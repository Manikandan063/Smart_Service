const express = require('express');
const {
    getAllUsers,
    getAllTechnicians,
    getDashboardStats,
    generateReport,
    registerTechnician
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/technicians', getAllTechnicians);
router.post('/register-technician', registerTechnician);
router.get('/dashboard', getDashboardStats);
router.get('/report', generateReport);

module.exports = router;
