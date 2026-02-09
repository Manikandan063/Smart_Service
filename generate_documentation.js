const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 50 });
const outputPath = path.join(__dirname, 'Smart_Service_Process_Documentation.pdf');
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

// Header
doc.fontSize(28).font('Helvetica-Bold').fillColor('#2c3e50').text('Smart Service API Documentation', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(14).font('Helvetica').fillColor('#34495e').text('Complete Process Guide for Admin, Users, Technicians & Bookings', { align: 'center' });
doc.moveDown(1);
doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#2c3e50').stroke();
doc.moveDown(2);

function addSection(title) {
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#2980b9').text(title);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#bdc3c7').lineWidth(1).stroke();
    doc.moveDown(1);
}

function addSubSection(title) {
    doc.fontSize(15).font('Helvetica-Bold').fillColor('#8e44ad').text(title);
    doc.moveDown(0.5);
}

function addEndpoint(action, method, url, body, description = '') {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#2c3e50').text(`${action}`, { continued: true });
    doc.font('Helvetica-Bold').fillColor(method === 'POST' ? '#27ae60' : method === 'PUT' ? '#f39c12' : method === 'DELETE' ? '#e74c3c' : '#2980b9').text(`  [${method}]`, { continued: true });
    doc.font('Helvetica').fillColor('#7f8c8d').text(` ${url}`);

    if (description) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor('#34495e').text(description, { indent: 10 });
    }

    if (body && body !== '(No Body)') {
        doc.moveDown(0.3);
        doc.fontSize(10).font('Courier').fillColor('#ffffff').rect(50, doc.y, 500, 20).fill('#2d3436');
        doc.fillColor('#ffffff').text('  Request Body (JSON)', 55, doc.y - 15);

        try {
            const formattedBody = JSON.stringify(JSON.parse(body), null, 4);
            doc.moveDown(0.5);
            doc.fontSize(9).font('Courier').fillColor('#2d3436').text(formattedBody, {
                indent: 20,
                lineGap: 2
            });
        } catch (e) {
            doc.text(body, { indent: 20 });
        }
    } else {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor('#95a5a6').text('   (No Request Body Required)', { indent: 20 });
    }
    doc.moveDown(1.5);
}

// 1. ADMIN PROCESS
addSection('1. ADMIN OPERATIONS');
addSubSection('Authentication');
addEndpoint('Admin Login', 'POST', '/api/auth/login', '{"email": "admin@smartservice.com", "password": "admin123", "role": "admin"}', 'Standard login for system administrator.');

addSubSection('Technician Management');
addEndpoint('Register New Technician', 'POST', '/api/admin/register-technician', '{"name": "Alex Tech", "email": "alex@tech.com", "password": "password123", "phone": "8887776665", "specialization": ["AC", "Washing Machine"]}', 'Allows admin to onboard new service professionals.');
addEndpoint('Get All Technicians', 'GET', '/api/admin/technicians', '(No Body)', 'Fetch list of all technicians and their status.');

addSubSection('Booking & Resource Control');
addEndpoint('Assign Technician to Booking', 'PUT', '/api/bookings/:id', '{"technician": "65b...", "status": "Assigned"}', 'Manually assign a technician to a pending booking.');
addEndpoint('Get All Users', 'GET', '/api/admin/users', '(No Body)', 'List all registered customers.');
addEndpoint('Admin Dashboard Stats', 'GET', '/api/admin/dashboard', '(No Body)', 'Retrieve system-wide analytics and statistics.');

doc.addPage();

// 2. USER PROCESS
addSection('2. USER OPERATIONS');
addSubSection('Account Management');
addEndpoint('User Registration', 'POST', '/api/auth/register', '{"name": "John Doe", "email": "john@gmail.com", "password": "password123", "phone": "9876543210", "address": {"street": "123 Main St", "city": "Chennai", "state": "TN", "zipCode": "600001"}}', 'Create a new customer account.');
addEndpoint('Update Profile', 'PUT', '/api/auth/updatedetails', '{"name": "John Updated", "phone": "9998887776", "address": {"street": "456 New St"}}', 'Change user contact or address details.');

addSubSection('Booking Experience');
addEndpoint('Create Service Booking', 'POST', '/api/bookings', '{"applianceType": "AC", "serviceType": "Repair", "description": "Continuous water leakage from indoor unit", "scheduledDate": "2024-02-15T10:00:00Z", "address": {"street": "123 Main St", "city": "Chennai"}}', 'New service request for an appliance.');
addEndpoint('View My Bookings', 'GET', '/api/bookings', '(No Body)', 'Get history of all personal service requests.');
addEndpoint('Cancel Booking', 'PUT', '/api/bookings/:id', '{"status": "Cancelled"}', 'Cancel a booking before it is processed.');

doc.addPage();

// 3. TECHNICIAN PROCESS
addSection('3. TECHNICIAN OPERATIONS');
addSubSection('Workflow Management');
addEndpoint('Accept/Reject Assigned Booking', 'PUT', '/api/bookings/:id', '{"acceptanceStatus": "Accepted"}', 'Choose "Accepted" to start work or "Rejected" to return to pool.');
addEndpoint('Complete Service & Diagnosis', 'PUT', '/api/bookings/:id', '{"status": "Completed", "diagnosis": "Drain pipe was clogged with dust, cleared it.", "totalAmount": 1200, "paymentStatus": "Paid"}', 'Updates the booking with final findings and marks as finished.');

addSubSection('Performance Tracking');
addEndpoint('Technician Dashboard', 'GET', '/api/technician/dashboard', '(No Body)', 'View assigned tasks and current work status.');
addEndpoint('Income Details', 'GET', '/api/technician/income', '(No Body)', 'Check total earnings and payment history.');

doc.moveDown(2);

// 4. BOOKING & PAYMENT JSON STRUCTURES
addSection('4. BOOKING & PAYMENT SUMMARY');
addSubSection('Booking Status Flow');
doc.fontSize(10).font('Helvetica').fillColor('#2c3e50').list([
    'Booked: Initial state after user creates a request.',
    'Assigned: Admin has picked a technician.',
    'In Progress: Technician has accepted and is working.',
    'Completed: Work finished, diagnosis recorded.',
    'Cancelled: User or Admin cancelled the request.'
]);
doc.moveDown(1);

addSubSection('Payment Record');
addEndpoint('Create Payment Log', 'POST', '/api/payments', '{"bookingId": "65b...", "amount": 1200, "method": "Cash", "status": "Success"}', 'Logs the transaction details for a completed booking.');

doc.moveDown(3);

// 5. SERVER SETUP INSTRUCTIONS
addSection('5. SYSTEM SETUP');
doc.fontSize(12).font('Helvetica').fillColor('#2c3e50').text('To run the Smart Service backend locally:', { underline: true });
doc.moveDown(0.5);
doc.list([
    'Install dependencies: npm install',
    'Seed Admin User: node seedAdmin.js (Credentials: admin@smartservice.com / admin123)',
    'Start Server: node server.js',
    'Base URL: http://localhost:5000'
], { bulletRadius: 3 });

doc.end();

stream.on('finish', () => {
    console.log('Documentation PDF generated: Smart_Service_Process_Documentation.pdf');
});

