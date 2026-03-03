const express = require('express');
const {
    getTechnicianDashboard,
    getIncomeDetails,
    requestWithdrawal
} = require('../controllers/technicianController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('technician'));

router.get('/dashboard', getTechnicianDashboard);
router.get('/income', getIncomeDetails);
router.post('/withdraw', requestWithdrawal);

module.exports = router;
