const express = require('express');
const router = express.Router();
const { register, login, getUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);
router.get('/user', protect, getUser);

module.exports = router;
