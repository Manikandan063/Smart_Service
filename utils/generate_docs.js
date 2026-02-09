const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('API_Documentation.pdf'));

// Title
doc.fontSize(25).text('Smart Service System - API Documentation', { align: 'center' });
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

addEndpoint('GET', '/api/auth/me', 'Get current logged in user profile (Requires Token)', null);
addEndpoint('GET', '/api/auth/logout', 'Logout user', null);

doc.addPage();

// BOOKING MODULE
doc.fontSize(18).text('2. Booking Module', { underline: true });
doc.moveDown();

addEndpoint('POST', '/api/bookings', 'Create a new Booking (Requires User Token)', {
    applianceType: "AC",
    serviceType: "Repair",
    description: "Cooling is not working properly",
    scheduledDate: "2023-12-25",
    address: { street: "123 Main St", city: "New York", state: "NY", zipCode: "10001" }
});

addEndpoint('GET', '/api/bookings', 'Get all bookings (Filter depends on Role)', null);

addEndpoint('GET', '/api/bookings/:id', 'Get single booking details', null);

addEndpoint('PUT', '/api/bookings/:id', 'Update Booking Status (Technician/Admin)', {
    status: "In Progress"
});

addEndpoint('DELETE', '/api/bookings/:id', 'Delete Booking (Admin only)', null);

// TECHNICIAN MODULE
doc.fontSize(18).text('3. Technician Module', { underline: true });
doc.moveDown();

addEndpoint('GET', '/api/technician/dashboard', 'Get dashboard stats (Technician Token)', null);
addEndpoint('GET', '/api/technician/income', 'Get income details (Technician Token)', null);

doc.addPage();

// ADMIN MODULE
doc.fontSize(18).text('4. Admin Module', { underline: true });
doc.moveDown();

addEndpoint('GET', '/api/admin/users', 'Get all users', null);
addEndpoint('GET', '/api/admin/technicians', 'Get all technicians', null);
addEndpoint('GET', '/api/admin/dashboard', 'Get admin dashboard stats', null);
addEndpoint('GET', '/api/admin/report', 'Download PDF Report', null);

// PAYMENT MODULE
doc.fontSize(18).text('5. Payment Module', { underline: true });
doc.moveDown();

addEndpoint('POST', '/api/payments', 'Record a Payment', {
    bookingId: "65b2f8...",
    amount: 500,
    method: "Cash",
    status: "Success"
});

addEndpoint('GET', '/api/payments', 'Get payment history', null);

doc.end();
console.log('PDF Generated');
