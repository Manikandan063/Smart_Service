const User = require('../models/User');
const Technician = require('../models/Technician');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const PDFDocument = require('pdfkit');
const path = require('path');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all technicians
// @route   GET /api/admin/technicians
// @access  Private (Admin)
exports.getAllTechnicians = async (req, res, next) => {
    try {
        const technicians = await Technician.find();
        res.status(200).json({ success: true, count: technicians.length, data: technicians });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Register technician
// @route   POST /api/admin/register-technician
// @access  Private (Admin)
exports.registerTechnician = async (req, res, next) => {
    try {
        const { name, email, password, phone, specialization } = req.body;

        const technician = await Technician.create({
            name,
            email,
            password,
            phone,
            specialization
        });

        res.status(201).json({
            success: true,
            data: technician
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalTechnicians = await Technician.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const completedBookings = await Booking.countDocuments({ status: 'Completed' });
        const pendingBookings = await Booking.countDocuments({ status: 'Booked' }); // Not assigned yet

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalTechnicians,
                totalBookings,
                completedBookings,
                pendingBookings
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Generate downloadable reports (PDF)
// @route   GET /api/admin/report
// @access  Private (Admin)
exports.generateReport = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name')
            .populate('technician', 'name');

        const doc = new PDFDocument();
        const filename = 'report.pdf';

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Pipe the PDF into the response
        doc.pipe(res);

        // Title
        doc.fontSize(20).text('Service Booking Report', { align: 'center' });
        doc.moveDown();

        // Table Header
        const tableTop = 150;
        const itemHeight = 30;

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Booking ID', 50, tableTop);
        doc.text('User', 150, tableTop);
        doc.text('Technician', 250, tableTop);
        doc.text('Appliance', 350, tableTop);
        doc.text('Status', 450, tableTop);

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table Rows
        let yPosition = tableTop + 30;

        doc.font('Helvetica').fontSize(9);

        bookings.forEach(booking => {
            if (yPosition > 700) {
                doc.addPage();
                yPosition = 50;
            }

            doc.text(booking._id.toString().substring(0, 8) + '...', 50, yPosition);
            doc.text(booking.user ? booking.user.name : 'N/A', 150, yPosition);
            doc.text(booking.technician ? booking.technician.name : 'N/A', 250, yPosition);
            doc.text(booking.applianceType, 350, yPosition);
            doc.text(booking.status, 450, yPosition);

            yPosition += itemHeight;
        });

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
