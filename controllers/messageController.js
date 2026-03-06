const Message = require('../models/Message');
const Booking = require('../models/Booking');

// @desc    Get messages for a specific booking
// @route   GET /api/messages/:bookingId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ booking: req.params.bookingId })
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { bookingId, content, senderModel } = req.body;

        // Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const message = await Message.create({
            booking: bookingId,
            sender: req.user.id, // Assumes req.user is set by auth middleware
            senderModel: senderModel,
            content
        });

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
