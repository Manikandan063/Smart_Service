const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();

// Route files
const auth = require('./routes/authRoutes');
const bookings = require('./routes/bookingRoutes');
const technicians = require('./routes/technicianRoutes');
const admin = require('./routes/adminRoutes');
const payments = require('./routes/paymentRoutes');
const messages = require('./routes/messageRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/bookings', bookings);
app.use('/api/technician', technicians);
app.use('/api/admin', admin);
app.use('/api/payments', payments);
app.use('/api/messages', messages);

module.exports = app;
