import Flights from "../../models/Flights.js";
import Seat from '../../models/Seat.js';
import Users from "../../models/Users.js";
import { AuthenticationError, AuthorizationError, NotFoundError } from "../../utils/CustomErrors.js";

// export const reserveSeatDB = async (seatId, userId) => {
//     try{
//         const seat = await Seat.findOne({
//             where: { id: seatId, status: 'available' },
        
//             include: [{
//                 model: Flights,
//                 as: 'flight',
//                 attributes: ['flightNumber','airline']
//             }]})
//             const user = await Users.findOne({
//             where: { id: userId }   
//         });

//         if (!seat) {
//             throw new Error('Seat not found or already reserved');
//         }

//         const lockTime = 15 * 60 * 1000; 

//         await seat.update({
//             status: 'reserved',
//             locked_by: userId,
//             lock_expiry: new Date(Date.now() + lockTime)
//         });

//         return seat;



//     }
//     catch (error) {
//         console.error("Error reserving seat:", error);
//         throw new Error('Could not reserve seat');
//     }
// }

// export const releaseSeatDB = async (seatId, userId) => {
//     try {
//         const seat = await Seat.findOne({
//             where: { id: seatId, locked_by: userId, status: 'reserved' },
//         });
//         if (!seat) {
//             throw new Error('Seat not found or not reserved by this user');
//         }

//         await seat.update({
//             status: 'available',
//             locked_by: null,
//             lock_expiry: null
//         });

//         if (!seat) {
//             throw new Error('Seat not found or not reserved by this user');
//         }

//         await seat.update({
//             status: 'available',
//             locked_by: null,
//             lock_expiry: null
//         });

//         return seat;
//     }
//     catch (error) {
//         console.error("Error releasing seat:", error);
//         throw new Error('Could not release seat');
//     }
// }

export const getReservedSeatsDB = async (userId) => {

        const user = await Users.findByPk(userId);
        if (!user) {
            throw new NotFoundError(`User with ID ${userId} not found`);
        }

        const reservedSeats = await Seat.findAll({
            where: { locked_by: userId, status: 'reserved' },
            include: [{
                model: Flights,
                as: 'flight',
                attributes: ['flightNumber', 'airline']
            }]
        });
        
        if (!reservedSeats || reservedSeats.length === 0) {
            throw new NotFoundError('No reserved seats found for this user');
        }

        return reservedSeats;
   
}