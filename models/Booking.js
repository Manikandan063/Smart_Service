const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician'
    },
    applianceType: {
        type: String,
        required: [true, 'Please select appliance type'],
        enum: ['AC', 'Fridge', 'Washing Machine', 'TV', 'Microwave', 'General']
    },
    serviceType: {
        type: String,
        required: [true, 'Please select service type'],
        enum: ['Repair', 'Installation', 'Maintenance']
    },
    description: {
        type: String,
        required: [true, 'Please describe the issue']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Please select a date']
    },
    status: {
        type: String,
        enum: ['Booked', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Booked'
    },
    acceptanceStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    diagnosis: {
        type: String,
        // Detailed complaint/diagnosis found by technician
    },
    rejectionReason: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
