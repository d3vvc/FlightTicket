import express from 'express';
import * as Controller from './controller';

const router = express.Router();


router.get('/reserved', Controller.getReservedSeats);

export default router;