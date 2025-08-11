import express from 'express';
import * as Controller from './controller';
// import  Auth from '../../middlewares/auth.js';

const router = express.Router();

router.get('/get', Controller.getAllFlights);
router.get('/get/:flightId', Controller.getFlightbyId);
router.post('/create', Controller.createFlight);
router.post('/search', Controller.handleFlightSearch);

export default router;          