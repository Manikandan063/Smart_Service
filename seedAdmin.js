const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            console.log('Admin user already exists.');
            process.exit();
        }

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@smartservice.com',
            password: 'adminpassword123',
            phone: '0000000000',
            role: 'admin'
        });

        console.log('Admin user created successfully!');
        console.log('Email: admin@smartservice.com');
        console.log('Password: adminpassword123');
        console.log('Please change your password after logging in.');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
