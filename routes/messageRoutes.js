const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth'); // Fixed path from authMiddleware to auth

router.use(protect);

router.get('/:bookingId', getMessages);
router.post('/', sendMessage);

module.exports = router;
