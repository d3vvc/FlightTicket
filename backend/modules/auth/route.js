import express from 'express';
import cookieParser from 'cookie-parser';
import * as Controller from './controller.js';


const router = express.Router();
router.use(cookieParser());

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.post('/logout', Controller.logout);

export default router;