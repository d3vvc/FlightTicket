import { getReservedSeatsDB, reserveSeatDB, releaseSeatDB } from "./service.js";

export const getReservedSeats = async (req, res) => {
    const { userId } = req.body;
    try {
        const reservedSeats = await getReservedSeatsDB(userId);
        res.status(200).json(reservedSeats);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error fetching reserved seats:", error);
    }
}

export const reserveSeat = async (req, res) => {
    const { seatId, userId } = req.body;
    try {
        const seat = await reserveSeatDB(seatId, userId);
        res.status(200).json(seat);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error reserving seat:", error);
    }
}

export const releaseSeat = async (req, res) => {
    const { seatId, userId } = req.body;
    try {
        const seat = await releaseSeatDB(seatId, userId);
        res.status(200).json(seat);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error releasing seat:", error);
    }
}