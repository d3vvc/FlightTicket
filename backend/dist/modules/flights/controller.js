"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFlightSearch = exports.createFlight = exports.getFlightbyNumber = exports.getAllFlights = void 0;
const service_1 = require("./service");
const getAllFlights = async (req, res, next) => {
    try {
        const flights = await (0, service_1.getAllFlightsDB)();
        res.status(200).json({ success: true, message: "All flights fetched successfully", flights });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllFlights = getAllFlights;
const getFlightbyNumber = async (req, res, next) => {
    const { flightNumber } = req.params;
    console.log("Flight Number:", flightNumber);
    try {
        const flight = await (0, service_1.getFlightByNumberDB)(flightNumber);
        res.status(200).json({ success: true, message: "Flight fetched successfully", flight });
    }
    catch (error) {
        next(error);
    }
};
exports.getFlightbyNumber = getFlightbyNumber;
const createFlight = async (req, res, next) => {
    const { flightData, userId } = req.body;
    try {
        const flight = await (0, service_1.createFlightDB)(userId, flightData);
        res.status(201).json({ success: true, message: "Flight created successfully", flight });
    }
    catch (error) {
        next(error);
    }
};
exports.createFlight = createFlight;
const handleFlightSearch = async (req, res, next) => {
    const { origin, destination, seat_class, date, sortBy } = req.body;
    try {
        const flights = await (0, service_1.handleFlightSearchDB)(origin, destination, seat_class, date, sortBy);
        res.status(200).json({ success: true, message: "Flight search results", flights });
    }
    catch (error) {
        next(error);
    }
};
exports.handleFlightSearch = handleFlightSearch;
