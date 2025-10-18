const express = require('express');
const { registerUser, loginUser,verifyEmailOtp,forgotPassword,verifyResetOtp,resetPassword } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

router.post('/verifyResetOtp', verifyResetOtp);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/verifyEmailOtp', verifyEmailOtp);

module.exports = router;
