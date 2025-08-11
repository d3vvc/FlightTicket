import express from 'express';
import cookieParser from 'cookie-parser';
import * as Controller from './controller';


const router = express.Router();
router.use(cookieParser());

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.post('/logout', Controller.logout);
router.post('/refresh-token', Controller.refreshToken);
router.post('/send-otp', Controller.send_OTP);
router.post('/verify-otp', Controller.verify_OTP);
router.post('/reset-password', Controller.reset_password);

export default router;