const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Both User and Technician (via refPath or manual check)
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Technician']
    },
    content: {
        type: String,
        required: [true, 'Message content cannot be empty']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
