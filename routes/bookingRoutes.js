const express = require('express');
const {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getBookings)
    .post(createBooking);

router
    .route('/:id')
    .get(getBooking)
    .put(updateBooking)
    .delete(authorize('admin'), deleteBooking);

module.exports = router;
