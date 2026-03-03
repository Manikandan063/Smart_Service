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
        enum: ['AC', 'Fridge', 'Washing Machine', 'TV', 'Microwave', 'Microwave Oven', 'Refrigerator', 'Water Purifier', 'General']
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
        type: String,
        required: [true, 'Please provide a service address']
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
    paymentMethod: {
        type: String,
        enum: ['Cash', 'GPay', 'Not Selection'],
        default: 'Not Selection'
    },
    totalAmount: {
        type: Number
    },
    estimatedCost: {
        type: Number
    },
    findings: {
        type: String // Detailed technician notes
    },
    photo: {
        type: String // URL to photo proof
    },
    cashCollectionRequested: {
        type: Boolean,
        default: false
    },
    serviceImage: {
        type: String // URL to image provided by technician (legacy)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
