import express from 'express';
import { signUp , signIn , signOut ,sendOtp,verifyOtp,resetPassword } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
