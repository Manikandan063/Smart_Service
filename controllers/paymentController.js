const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Create/Update Payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
    try {
        const { bookingId, amount, method, status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const payment = await Payment.create({
            booking: bookingId,
            user: booking.user,
            amount,
            method,
            status: status || 'Pending',
            transactionId: 'TXN' + Date.now()
        });

        // Update booking payment status
        if (status === 'Success') {
            booking.paymentStatus = 'Paid';
            await booking.save();
        }

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get payment history
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'admin') {
            query = Payment.find().populate('booking').populate('user', 'name');
        } else {
            query = Payment.find({ user: req.user.id }).populate('booking');
        }

        const payments = await query;

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
