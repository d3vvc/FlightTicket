"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservedSeatsDB = exports.releaseSeatDB = exports.reserveSeatDB = void 0;
const Flights_1 = __importDefault(require("../../models/Flights"));
const Seat_1 = __importDefault(require("../../models/Seat"));
const Users_1 = __importDefault(require("../../models/Users"));
const CustomErrors_1 = require("../../utils/CustomErrors");
const reserveSeatDB = async (seatId, userId) => {
    try {
        const seat = await Seat_1.default.findOne({
            where: { id: seatId, status: 'available' },
            include: [{
                    model: Flights_1.default,
                    as: 'flight',
                    attributes: ['flightNumber', 'airline']
                }]
        });
        const user = await Users_1.default.findOne({
            where: { id: userId }
        });
        if (!seat) {
            throw new Error('Seat not found or already reserved');
        }
        const lockTime = 15 * 60 * 1000;
        await seat.update({
            status: 'reserved',
            locked_by: userId,
            lock_expiry: new Date(Date.now() + lockTime)
        });
        return seat;
    }
    catch (error) {
        console.error("Error reserving seat:", error);
        throw new Error('Could not reserve seat');
    }
};
exports.reserveSeatDB = reserveSeatDB;
const releaseSeatDB = async (seatId, userId) => {
    try {
        const seat = await Seat_1.default.findOne({
            where: { id: seatId, locked_by: userId, status: 'reserved' },
        });
        if (!seat) {
            throw new Error('Seat not found or not reserved by this user');
        }
        await seat.update({
            status: 'available',
            locked_by: null,
            lock_expiry: null
        });
        if (!seat) {
            throw new Error('Seat not found or not reserved by this user');
        }
        await seat.update({
            status: 'available',
            locked_by: null,
            lock_expiry: null
        });
        return seat;
    }
    catch (error) {
        console.error("Error releasing seat:", error);
        throw new Error('Could not release seat');
    }
};
exports.releaseSeatDB = releaseSeatDB;
const getReservedSeatsDB = async (userId) => {
    const user = await Users_1.default.findByPk(userId);
    if (!user) {
        throw new CustomErrors_1.NotFoundError(`User with ID ${userId} not found`);
    }
    const reservedSeats = await Seat_1.default.findAll({
        where: { locked_by: userId, status: 'reserved' },
        include: [{
                model: Flights_1.default,
                as: 'flight',
                attributes: ['flightNumber', 'airline']
            }]
    });
    if (!reservedSeats || reservedSeats.length === 0) {
        throw new CustomErrors_1.NotFoundError('No reserved seats found for this user');
    }
    return reservedSeats;
};
exports.getReservedSeatsDB = getReservedSeatsDB;
