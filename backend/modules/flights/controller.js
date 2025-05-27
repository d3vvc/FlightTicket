import { getAllFlightsDB, getFlightByNumberDB, createFlightDB, handleFlightSearchDB } from "./service.js";

export const getAllFlights = async (req, res) => {
    try {
        const flights = await getAllFlightsDB();
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error fetching all flights:", error);
    }
}

export const getFlightbyNumber = async (req, res) => {
    const {flightNumber} = req.params;
    console.log("Flight Number:", flightNumber);
    try {
        const flight = await getFlightByNumberDB(flightNumber);
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message, flightNumber });
        console.error("Error fetching flight by number:", error);
    }
}
export const createFlight = async (req, res) => {
    const flightData = req.body;
    try {
        const flight = await createFlightDB(flightData);
        res.status(201).json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error creating flight:", error);
    }
}

export const handleFlightSearch = async (req, res) => {
    const {origin, destination, seat_class, date, sortBy} = req.body;
    try {
        const flights = await handleFlightSearchDB(origin, destination, seat_class, date, sortBy);
        res.status(200).json(flights);
} catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error handling flight search:", error);
    }}