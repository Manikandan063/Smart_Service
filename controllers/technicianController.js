const mongoose = require('mongoose');
const Technician = require('../models/Technician');
const Booking = require('../models/Booking');

// @desc    Get technician dashboard stats
// @route   GET /api/technician/dashboard
// @access  Private (Technician)
exports.getTechnicianDashboard = async (req, res, next) => {
    try {
        const technicianId = req.user._id || req.user.id;

        const totalAssigned = await Booking.countDocuments({ technician: technicianId });
        const pending = await Booking.countDocuments({ technician: technicianId, status: 'Assigned', acceptanceStatus: 'Pending' });
        const inProgress = await Booking.countDocuments({ technician: technicianId, status: 'In Progress' });
        const completed = await Booking.countDocuments({ technician: technicianId, status: 'Completed' });

        // Calculate Monthly Earnings
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const monthlyEarningsResult = await Booking.aggregate([
            {
                $match: {
                    technician: new mongoose.Types.ObjectId(technicianId.toString()),
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
        console.error('getIncomeDetails Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Request withdrawal of earnings
// @route   POST /api/technician/withdraw
// @access  Private (Technician)
exports.requestWithdrawal = async (req, res, next) => {
    try {
        const technicianId = req.user.id || req.user._id;

        // Fetch fresh copy to ensure accurate balance
        const technician = await Technician.findById(technicianId);

        if (!technician) {
            return res.status(404).json({ success: false, message: 'Technician profile not found' });
        }

        const amountToWithdraw = technician.earnings || 0;

        if (amountToWithdraw <= 0) {
            return res.status(400).json({ success: false, message: 'No earnings are available for withdrawal' });
        }

        // Ideally, create a WithdrawalRecord here for tracking
        // For now, we update the balance directly
        await Technician.findByIdAndUpdate(technicianId, {
            $set: { earnings: 0 }
        });

        res.status(200).json({
            success: true,
            amount: amountToWithdraw,
            message: 'Withdrawal processed successfully. Your balance is now 0.'
        });
    } catch (err) {
        console.error('requestWithdrawal Error:', err);
        res.status(500).json({ success: false, message: 'Server error details: ' + (err.message || 'Unknown Error') });
    }
};
