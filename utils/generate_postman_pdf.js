const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('Postman_Testing_Documentation.pdf'));

// Title
doc.fontSize(25).font('Helvetica-Bold').text('Smart Service - Postman Testing Guide', { align: 'center' });
doc.moveDown();
doc.fontSize(12).font('Helvetica').text('Use these JSON bodies in Postman (Raw Body -> JSON) for testing.', { align: 'center' });
doc.moveDown();

function addEndpoint(title, method, url, body, isPrivate = false) {
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#2c3e50').text(title);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(isPrivate ? '#e67e22' : '#27ae60').text(`${method} ${url} ${isPrivate ? '(Requires Token)' : '(Public)'}`);

    if (body) {
        doc.moveDown(0.5);
        doc.fontSize(10).font('Courier').fillColor('#000000').text(JSON.stringify(body, null, 2));
    }
    doc.moveDown();
    doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).strokeColor('#bdc3c7').stroke();
    doc.moveDown();
}

// 1. AUTH
doc.fontSize(18).font('Helvetica-Bold').fillColor('#2980b9').text('1. Authentication');
doc.moveDown(0.5);

addEndpoint('User Registration', 'POST', '/api/auth/register', {
    name: "Jane User",
    email: "jane@example.com",
    password: "password123",
    phone: "9876543210",
    address: {
        street: "123 Main St",
        city: "Chennai",
        state: "TN",
        zipCode: "600001"
    }
});

addEndpoint('Login (Admin/User/Tech)', 'POST', '/api/auth/login', {
    email: "admin@smartservice.com",
    password: "admin123",
    role: "admin"
});

doc.addPage();

// 2. ADMIN
doc.fontSize(18).font('Helvetica-Bold').fillColor('#2980b9').text('2. Admin Operations');
doc.moveDown(0.5);

addEndpoint('Register Technician', 'POST', '/api/admin/register-technician', {
    name: "Alex Tech",
    email: "alex@tech.com",
    password: "password123",
    phone: "8887776665",
    specialization: ["AC", "Washing Machine"]
}, true);

addEndpoint('Assign Technician to Booking', 'PUT', '/api/bookings/:id', {
    technician: "65bf...tech_id...",
    status: "Assigned"
}, true);

// 3. USER
doc.fontSize(18).font('Helvetica-Bold').fillColor('#2980b9').text('3. User Operations');
doc.moveDown(0.5);

addEndpoint('Create Booking', 'POST', '/api/bookings', {
    applianceType: "AC",
    serviceType: "Repair",
    description: "AC not cooling and making loud noise",
    scheduledDate: "2024-02-10T10:00:00Z",
    address: {
        street: "123 Main St",
        city: "Chennai",
        state: "TN",
        zipCode: "600001"
    }
}, true);

doc.addPage();

// 4. TECHNICIAN
doc.fontSize(18).font('Helvetica-Bold').fillColor('#2980b9').text('4. Technician Operations');
doc.moveDown(0.5);

addEndpoint('Accept Booking', 'PUT', '/api/bookings/:id', {
    acceptanceStatus: "Accepted"
}, true);

addEndpoint('Update Diagnosis & Cost', 'PUT', '/api/bookings/:id', {
    diagnosis: "Capacitor failure and gas leak detected.",
    totalAmount: 1500,
    status: "In Progress"
}, true);

addEndpoint('Mark Completed', 'PUT', '/api/bookings/:id', {
    status: "Completed",
    paymentStatus: "Paid"
}, true);

// 5. PAYMENTS
doc.fontSize(18).font('Helvetica-Bold').fillColor('#2980b9').text('5. Payments');
doc.moveDown(0.5);

addEndpoint('Record Payment', 'POST', '/api/payments', {
    booking: "65bf...booking_id...",
    amount: 1500,
    paymentMethod: "Cash"
}, true);

doc.end();
console.log('Postman_Testing_Documentation.pdf created successfully');
