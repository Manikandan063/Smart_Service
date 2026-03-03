const Booking = require('../models/Booking');
const User = require('../models/User');
const Technician = require('../models/Technician');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const booking = await Booking.create(req.body);

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (User: own, Technician: assigned, Admin: all)
exports.getBookings = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'user') {
            query = Booking.find({ user: req.user.id }).populate('technician', 'name phone');
        } else if (req.user.role === 'technician') {
            query = Booking.find({ technician: req.user.id }).populate('user', 'name address phone');
        } else {
            // Admin
            query = Booking.find().populate('user', 'name').populate('technician', 'name');
        }

        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id)
            .populate('user', 'name address phone email')
            .populate('technician', 'name phone');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Access Control & Privacy
        if (req.user.role === 'user' && booking.user._id.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // If Technician hasn't accepted yet, hide sensitive User info
        if (req.user.role === 'technician') {
            // Must be assigned to this tech (or was assigned)
            if (booking.technician && booking.technician._id.toString() !== req.user.id) {
                // Unless it's a pool view? But currently assignments are direct.
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }

            if (booking.acceptanceStatus !== 'Accepted') {
                // Return sanitized object
                const bookingObj = booking.toObject();
                if (bookingObj.user) {
                    bookingObj.user.address = {
                        city: bookingObj.user.address ? bookingObj.user.address.city : 'N/A',
                        street: 'Hidden until Accepted',
                        zipCode: 'Hidden until Accepted',
                        state: bookingObj.user.address ? bookingObj.user.address.state : 'N/A'
                    }; // Hide street
                    bookingObj.user.phone = "Hidden until Accepted";
                    bookingObj.user.email = "Hidden until Accepted";
                }
                return res.status(200).json({ success: true, data: bookingObj });
            }
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update booking (Assign, Accept/Reject, Diagnose, Complete)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // 1. ADMIN: Assign Technician
        if (req.user.role === 'admin') {
            // Admin can update anything. If assigning tech, reset acceptance.
            if (req.body.technician) {
                booking.technician = req.body.technician;
                booking.status = 'Assigned';
                booking.acceptanceStatus = 'Pending';
                booking.rejectionReason = undefined;
            }
            // Allow other updates
            booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            return res.status(200).json({ success: true, data: booking });
        }

        // 2. TECHNICIAN: Accept/Reject OR Update Progress
        if (req.user.role === 'technician') {
            if (!booking.technician || booking.technician.toString() !== req.user.id) {
                return res.status(401).json({ success: false, message: 'Not assigned to this task' });
            }

            // Handle Acceptance/Rejection
            if (req.body.acceptanceStatus) {
                if (req.body.acceptanceStatus === 'Accepted') {
                    booking.acceptanceStatus = 'Accepted';
                    booking.status = 'In Progress'; // Or stay Assigned until they start? Let's say In Progress.
                } else if (req.body.acceptanceStatus === 'Rejected') {
                    booking.acceptanceStatus = 'Rejected';
                    booking.rejectionReason = req.body.rejectionReason || 'No reason provided';
                    booking.status = 'Booked'; // Reset status effectively for Admin visibility
                    booking.technician = undefined; // Unassign so it goes back to pool
                }
            }

            // Handle work updates (Diagnosis, Cost, Findings, Photo, Completion)
            if (booking.acceptanceStatus === 'Accepted' || req.body.acceptanceStatus === 'Accepted') {
                const allowedFields = ['diagnosis', 'findings', 'photo', 'estimatedCost', 'totalAmount', 'status', 'paymentStatus', 'paymentMethod'];
                allowedFields.forEach(field => {
                    if (req.body[field] !== undefined) {
                        booking[field] = req.body[field];
                    }
                });
            } else if (!req.body.acceptanceStatus) {
                return res.status(400).json({ success: false, message: 'You must accept the booking first' });
            }
        }

        // 3. USER: Cancel only, OR record payment after service
        if (req.user.role === 'user') {
            if (req.body.status === 'Cancelled') {
                if (booking.status === 'Completed' || booking.status === 'In Progress') {
                    return res.status(400).json({ success: false, message: 'Cannot cancel active or completed booking' });
                }
                booking.status = 'Cancelled';
            } else if (req.body.paymentStatus === 'Paid' || req.body.paymentMethod === 'Cash') {
                // User settlement (Digital or Cash request)
                if (req.body.paymentStatus) booking.paymentStatus = req.body.paymentStatus;
                if (req.body.paymentMethod) booking.paymentMethod = req.body.paymentMethod;
                if (req.body.cashCollectionRequested !== undefined) {
                    booking.cashCollectionRequested = req.body.cashCollectionRequested;
                }
            } else {
                return res.status(401).json({ success: false, message: 'Invalid update for User role' });
            }
        }

        // If status is changed to Completed, update technician earnings
        if (booking.status === 'Completed' && booking.totalAmount > 0) {
            await Technician.findByIdAndUpdate(booking.technician, {
                $inc: { earnings: booking.totalAmount }
            });
        }

        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
