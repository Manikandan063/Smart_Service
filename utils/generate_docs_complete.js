const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('API_Documentation_Complete.pdf'));

// Title
doc.fontSize(25).text('Smart Service System - Complete API Documentation', { align: 'center' });
doc.moveDown();

// Helper to add endpoint
function addEndpoint(method, url, description, body) {
    doc.fontSize(14).font('Helvetica-Bold').fillColor('blue').text(`${method} ${url}`);
    doc.fontSize(12).font('Helvetica').fillColor('black').text(description);

    if (body) {
        doc.moveDown(0.5);
        doc.fontSize(10).font('Courier').text('JSON Body:', { underline: true });
        doc.text(JSON.stringify(body, null, 2));
    }
    doc.moveDown();
    doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
}

// AUTH MODULE
doc.fontSize(18).text('1. Authentication Module', { underline: true });
doc.moveDown();

addEndpoint('POST', '/api/auth/register', 'Register a new User', {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "9876543210",
    address: { street: "123 Main St", city: "New York", state: "NY", zipCode: "10001" }
});

addEndpoint('POST', '/api/auth/register-technician', 'Register a new Technician', {
    name: "Alex Tech",
    email: "alex@tech.com",
    password: "password123",
    phone: "9123456789",
    specialization: ["AC", "Fridge"]
});

addEndpoint('POST', '/api/auth/login', 'Login (User/Technician/Admin)', {
    email: "john@example.com",
    password: "password123",
    role: "user"
});

addEndpoint('GET', '/api/auth/me', 'Get current logged in user (Requires Token)', null);

doc.addPage();

// BOOKING WORKFLOW (New)
doc.fontSize(18).text('2. Booking Workflow (Step-by-Step)', { underline: true });
doc.moveDown();

addEndpoint('POST', '/api/bookings', 'Step 1: User creates a Booking', {
    applianceType: "AC",
    serviceType: "Repair",
    description: "Cooling is not working properly",
    scheduledDate: "2023-12-25",
    address: { street: "123 Main St", city: "New York", state: "NY", zipCode: "10001" }
});

addEndpoint('PUT', '/api/bookings/:id', 'Step 2: Admin Assigns Technician', {
    technician: "65b3cde..."
});

addEndpoint('PUT', '/api/bookings/:id', 'Step 3: Technician Accepts Request (Reveals Address)', {
    acceptanceStatus: "Accepted"
});

addEndpoint('PUT', '/api/bookings/:id', 'Alternative: Technician Rejects Request', {
    acceptanceStatus: "Rejected",
    rejectionReason: "Busy on another site"
});

addEndpoint('PUT', '/api/bookings/:id', 'Step 4: Technician Adds Diagnosis & Cost', {
    diagnosis: "Compressor failure",
    totalAmount: 2500,
    status: "In Progress"
});

addEndpoint('PUT', '/api/bookings/:id', 'Step 5: Technician Completes Job', {
    status: "Completed",
    paymentStatus: "Pending" // waiting for payment
});

doc.addPage();

// TECHNICIAN MODULE
doc.fontSize(18).text('3. Technician Module', { underline: true });
doc.moveDown();

addEndpoint('GET', '/api/technician/dashboard', 'Get Dashboard (Monthly Earnings, Recent Services)', null);
addEndpoint('GET', '/api/technician/income', 'Get Income History', null);

// ADMIN MODULE
doc.fontSize(18).text('4. Admin Module', { underline: true });
doc.moveDown();

addEndpoint('GET', '/api/admin/users', 'List Users', null);
addEndpoint('GET', '/api/admin/technicians', 'List Technicians', null);
addEndpoint('GET', '/api/admin/dashboard', 'Admin Stats', null);
addEndpoint('GET', '/api/admin/report', 'Download PDF Report', null);

// PAYMENT MODULE
doc.fontSize(18).text('5. Payment', { underline: true });
doc.moveDown();

addEndpoint('POST', '/api/payments', 'Process Payment', {
    bookingId: "65b2f8...",
    amount: 2500,
    method: "Cash",
    status: "Success"
});

doc.end();
console.log('Complete PDF Generated');
