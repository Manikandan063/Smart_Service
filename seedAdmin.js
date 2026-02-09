const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const createAdmin = async () => {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@smartservice.com' });

    if (adminExists) {
        console.log('Admin already exists');
        process.exit();
    }

    const admin = await User.create({
        name: 'Super Admin',
        email: 'admin@smartservice.com',
        password: 'admin123', // Change this!
        role: 'admin',
        phone: '9345577285'
    });

    console.log('Admin User Created Successfully');
    console.log('Email: admin@smartservice.com');
    console.log('Password: admin123');
    process.exit();
};

createAdmin();
