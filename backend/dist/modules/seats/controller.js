"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservedSeats = void 0;
const service_1 = require("./service");
const getReservedSeats = async (req, res, next) => {
    const { userId } = req.body;
    try {
        const reservedSeats = await (0, service_1.getReservedSeatsDB)(userId);
        res.status(200).json({ message: "Reserved seats fetched successfully", reservedSeats });
    }
    catch (error) {
        next(error);
    }
};
exports.getReservedSeats = getReservedSeats;
// export const reserveSeat = async (req, res) => {
//     const { seatId, userId } = req.body;
//     try {
//         const seat = await reserveSeatDB(seatId, userId);
//         res.status(200).json(seat);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//         console.error("Error reserving seat:", error);
//     }
// }
// export const releaseSeat = async (req, res) => {
//     const { seatId, userId } = req.body;
//     try {
//         const seat = await releaseSeatDB(seatId, userId);
//         res.status(200).json(seat);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//         console.error("Error releasing seat:", error);
//     }
// }
