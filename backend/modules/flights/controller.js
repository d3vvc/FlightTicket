import { getAllFlightsDB, getFlightByNumberDB, createFlightDB, handleFlightSearchDB } from "./service.js";

export const getAllFlights = async (req, res, next) => {
    try {
        const flights = await getAllFlightsDB();
        res.status(200).json({success: true, message: "All flights fetched successfully", flights});
    } catch (error) {
        next(error);
    }
}

export const getFlightbyNumber = async (req, res, next) => {
    const {flightNumber} = req.params;
    console.log("Flight Number:", flightNumber);
    try {
        const flight = await getFlightByNumberDB(flightNumber);
        res.status(200).json({success: true, message: "Flight fetched successfully", flight});
    } catch (error) {
        next(error);
    }
}
export const createFlight = async (req, res, next) => {
    const flightData = req.body;
    try {
        const flight = await createFlightDB(flightData);
        res.status(201).json({success: true, message: "Flight created successfully", flight});
    } catch (error) {
        next(error);
    }
}

export const handleFlightSearch = async (req, res, next) => {
    const {origin, destination, seat_class, date, sortBy} = req.body;
    try {
        const flights = await handleFlightSearchDB(origin, destination, seat_class, date, sortBy);
        res.status(200).json({success: true, message: "Flight search results", flights});
} catch (error) {
    next(error);
    }}