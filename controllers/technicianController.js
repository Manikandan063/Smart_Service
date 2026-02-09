const Technician = require('../models/Technician');
const Booking = require('../models/Booking');

// @desc    Get technician dashboard stats
// @route   GET /api/technician/dashboard
// @access  Private (Technician)
exports.getTechnicianDashboard = async (req, res, next) => {
    try {
        const totalAssigned = await Booking.countDocuments({ technician: req.user.id });
        const pending = await Booking.countDocuments({ technician: req.user.id, status: 'Assigned', acceptanceStatus: 'Pending' });
        const inProgress = await Booking.countDocuments({ technician: req.user.id, status: 'In Progress' });
        const completed = await Booking.countDocuments({ technician: req.user.id, status: 'Completed' });

        // Calculate Monthly Earnings
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const monthlyEarningsResult = await Booking.aggregate([
            {
                $match: {
                    technician: req.user._id, // technician stores ObjectId or simple ID? Model says ObjectId.
                    // But wait, booking.technician is an ObjectId.
                    // IMPORTANT: aggregate match on ObjectId requires casting if using string. 
                    // req.user._id is usually an ObjectId if coming from mongoose findById.
                    status: 'Completed',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const monthlyEarnings = monthlyEarningsResult.length > 0 ? monthlyEarningsResult[0].total : 0;

        // Recent Services
        const recentServices = await Booking.find({ technician: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name address');

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalAssigned,
                    pending,
                    inProgress,
                    completed,
                    totalEarnings: req.user.earnings,
                    monthlyEarnings
                },
                recentServices
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    View total income and task payment details
// @route   GET /api/technician/income
// @access  Private (Technician)
exports.getIncomeDetails = async (req, res, next) => {
    try {
        const completedBookings = await Booking.find({
            technician: req.user.id,
            status: 'Completed'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalEarnings: req.user.earnings,
            history: completedBookings
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
