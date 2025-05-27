import express from 'express';
import * as Controller from './controller.js';

const router = express.Router();


router.get('/reserved', Controller.getReservedSeats);
router.post('/reserve', Controller.reserveSeat);
router.post('/release', Controller.releaseSeat);

export default router;