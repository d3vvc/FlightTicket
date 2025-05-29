import Flights from "../../models/Flights.js";
import Seat from '../../models/Seat.js';    
import Users from "../../models/Users.js";
import '../../models/model_utils/associations.js';
import { Op } from 'sequelize';
import { NotFoundError, AuthorizationError, DatabaseError } from "../../utils/CustomErrors.js";

export const getAllFlightsDB = async () => {
   
        const flights = await Flights.findAll(
            {
                include: [{
                    model: Seat,
                    as: 'seats',
                    where: { status: 'available' },
                    attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
                }]
            }
        );
        if (!flights || flights.length === 0) {
            throw new NotFoundError('No flights found');
        }

        return flights;
    
}

export const getFlightByNumberDB = async (flightNumber) => {
   
        const flight = await Flights.findOne({
            where: { flightNumber },
            include: [{
                model: Seat,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
            }]
        });
        
        if (!flight) {
            throw new NotFoundError(`Flight with number ${flightNumber} not found`);
        }

        return flight;
   
}

export const createFlightDB = async (userId, flightData) => {

        const user = await Users.findByPk(userId);
        if (!user || user.role !== 'admin') {   
            throw new AuthorizationError('Only admins can create flights');
        }

        const flight = await Flights.create(flightData,{
            include: [{
                model: Seat,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
              }]
        });
        if (!flight) {
            throw new DatabaseError('Flight creation failed');
        }
        return flight;
   
}

export const handleFlightSearchDB = async (origin, destination, seat_class, date, sortBy = 'price') => {
    
        //add validation error check later - T

        const flights = await Flights.findAll({
            where:{
                origin: origin.toUpperCase(),
                destination: destination.toUpperCase(),
                departureTime: {
                    [Op.gte]: new Date(date)
                },
                arrivalTime: {
                    [Op.lte]: new Date(new Date(date).setHours(23, 59, 59))
                }
            },include: [{
                model: Seat,
                as: 'seats',
                where: { seat_class, status: 'available' },
                required: false,
                attributes: ['seat_class', 'price']
            }],
            order: sortBy === 'time' ? [['departureTime', 'ASC']] : [['id', 'ASC']],
        },
    )
        if (!flights || flights.length === 0) {
            throw new NotFoundError('No flights found for the given criteria');
        }
        
        return flights
}