import express from 'express';
import * as Controller from './controller.js';
// import  Auth from '../../middlewares/auth.js';

const router = express.Router();

router.get('/get', Controller.getAllFlights);
router.get('/get/:flightNumber', Controller.getFlightbyNumber);
router.post('/create', Controller.createFlight);
router.get('/search', Controller.handleFlightSearch);

export default router;      