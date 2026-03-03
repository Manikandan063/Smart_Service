# 🛠️ Smart Service Backend

A robust Node.js and Express-based backend system for managing appliance service bookings, technicians, and payments. This system powers the Smart Service ecosystem, providing secure authentication, role-based access control, and comprehensive service management.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based authentication with role-based access control (Admin, User, Technician).
- **📋 Booking Management**: Full lifecycle management for appliance services (AC, Washing Machine, etc.).
- **🔧 Technician Management**: Skills-based assignment and work progress tracking.
- **💳 Payment Integration**: Transaction logging and status tracking.
- **📧 Email Notifications**: Automated email alerts for bookings and status updates.
- **📊 Admin Dashboard**: Centralized control for all system operations.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, bcryptjs, cookie-parser
- **Notifications**: Nodemailer

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance

### 2. Installation
```bash
git clone <your-repo-url>
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables (refer to `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 4. Database Seeding (Optional)
To create an initial admin user:
```bash
node seedAdmin.js
```

### 5. Running the Application
```bash
# Development mode
npm start
```

## 📂 Project Structure
- `config/`: Configuration files (Database)
- `controllers/`: Request handling logic
- `models/`: Mongoose schemas
- `routes/`: API endpoint definitions
- `middleware/`: Custom middleware (Auth, etc.)
- `utils/`: Utility functions (Email, etc.)

## 📜 License
This project is licensed under the ISC License.
