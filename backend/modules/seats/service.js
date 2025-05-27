import Flights from "../../models/Flights.js";
import Seat from '../../models/Seat.js';
import Users from "../../models/Users.js";



export const reserveSeatDB = async (seatId, userId) => {
    try{
        const seat = await Seat.findOne({
            where: { id: seatId, status: 'available' },
        
            include: [{
                model: Flights,
                as: 'flight',
                attributes: ['flightNumber','airline']
            }]})
            const user = await Users.findOne({
            where: { id: userId }   
        });

        if (!seat) {
            throw new Error('Seat not found or already reserved');
        }

        const lockTime = 15 * 60 * 1000; 

        await seat.update({
            status: 'reserved',
            locked_by: user,
            lock_expiry: new Date(Date.now() + lockTime)
        });

        return seat;



    }
    catch (error) {
        console.error("Error reserving seat:", error);
        throw new Error('Could not reserve seat');
    }
}

export const releaseSeatDB = async (seatId, userId) => {
    try {
        const seat = await Seat.findOne({
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
}

export const getReservedSeatsDB = async (userId) => {
    try {
        const reservedSeats = await Seat.findAll({
            where: { locked_by: userId, status: 'reserved' },
            include: [{
                model: Flights,
                as: 'flight',
                attributes: ['flightNumber', 'airline']
            }]
        });
        return reservedSeats;
    } catch (error) {
        console.error("Error fetching reserved seats:", error);
        throw new Error('Could not fetch reserved seats');
    }
}