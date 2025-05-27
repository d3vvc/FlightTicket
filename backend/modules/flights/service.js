import Flights from "../../models/Flights.js";
import Seat from '../../models/Seat.js';    
import '../../models/model_utils/associations.js';
import { Op } from 'sequelize';

export const getAllFlightsDB = async () => {
    try {
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
        return flights;
    } catch (error) {
        console.error("Error fetching flights:", error);
        throw new Error('Could not fetch flights');
    }
}

export const getFlightByNumberDB = async (flightNumber) => {
    try {
        const flight = await Flights.findOne({
            where: { flightNumber },
            include: [{
                model: Seat,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
            }]
        });
        if (!flight) {
            throw new Error('Flight not found');
        }
        return flight;
    } catch (error) {
        console.error("Error fetching flight by ID:", error);
        throw new Error('Could not fetch flight');
    }
}

export const createFlightDB = async (flightData) => {
    try {
        const flight = await Flights.create(flightData,{
            include: [{
                model: Seat,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price']
              }]
        });
        return flight;
    } catch (error) {
        console.error("Error creating flight:", error);
        throw new Error('Could not create flight');
    }
}

export const handleFlightSearchDB = async (origin, destination, seat_class, date, sortBy = 'price') => {
    try {
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
        return flights
    }
    catch (error) {
        console.error("Error searching flights:", error);
        throw new Error('Could not search flights');
    }
}