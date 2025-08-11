"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFlightSearchDB = exports.createFlightDB = exports.getFlightByNumberDB = exports.getAllFlightsDB = void 0;
const Flights_1 = __importDefault(require("../../models/Flights"));
const Seat_1 = __importDefault(require("../../models/Seat"));
const Users_1 = __importDefault(require("../../models/Users"));
require("../../models/model_utils/associations");
const sequelize_1 = require("sequelize");
const CustomErrors_1 = require("../../utils/CustomErrors");
const getAllFlightsDB = async () => {
    const flights = await Flights_1.default.findAll({
        include: [{
                model: Seat_1.default,
                as: 'seats',
                where: { status: 'available' },
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
            }]
    });
    if (!flights || flights.length === 0) {
        throw new CustomErrors_1.NotFoundError('No flights found');
    }
    return flights;
};
exports.getAllFlightsDB = getAllFlightsDB;
const getFlightByNumberDB = async (flightNumber) => {
    const flight = await Flights_1.default.findOne({
        where: { flightNumber },
        include: [{
                model: Seat_1.default,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
            }]
    });
    if (!flight) {
        throw new CustomErrors_1.NotFoundError(`Flight with number ${flightNumber} not found`);
    }
    return flight;
};
exports.getFlightByNumberDB = getFlightByNumberDB;
const createFlightDB = async (userId, flightData) => {
    const user = await Users_1.default.findByPk(userId);
    if (!user || user.role !== 'admin') {
        throw new CustomErrors_1.AuthorizationError('Only admins can create flights');
    }
    const flight = await Flights_1.default.create(flightData, {
        include: [{
                model: Seat_1.default,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
            }]
    });
    if (!flight) {
        throw new CustomErrors_1.DatabaseError('Flight creation failed');
    }
    return flight;
};
exports.createFlightDB = createFlightDB;
const handleFlightSearchDB = async (origin, destination, seat_class, date, sortBy = 'price') => {
    //add validation error check later - T
    const flights = await Flights_1.default.findAll({
        where: {
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departureTime: {
                [sequelize_1.Op.gte]: new Date(date)
            },
            arrivalTime: {
                [sequelize_1.Op.lte]: new Date(new Date(date).setHours(23, 59, 59))
            }
        }, include: [{
                model: Seat_1.default,
                as: 'seats',
                where: { seat_class, status: 'available' },
                required: false,
                attributes: ['seat_class', 'price']
            }],
        order: sortBy === 'time' ? [['departureTime', 'ASC']] : [['id', 'ASC']],
    });
    if (!flights || flights.length === 0) {
        throw new CustomErrors_1.NotFoundError('No flights found for the given criteria');
    }
    return flights;
};
exports.handleFlightSearchDB = handleFlightSearchDB;
