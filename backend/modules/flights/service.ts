import Flights from "../../models/Flights";
import Seat from '../../models/Seat';    
import Users from "../../models/Users";
import '../../models/model_utils/associations';
import { Op } from 'sequelize';
import { FlightAttributes, FlightCreationAttributes } from "../../types/index";
import { sequelizer } from "../../config/db";
import { NotFoundError, AuthorizationError, DatabaseError } from "../../utils/CustomErrors";
import { broadcastMessage } from "../../services/seatWebSocket";


const cleanupExpiredSeats = async () => {
   setImmediate(async () => {
        try {
            const [affectedRowCount, updatedSeats] = await Seat.update({
                status: 'available',
                locked_by: null,
                lock_expiry: null
            }, {
                where: {
                    status: 'reserved',
                    lock_expiry: {
                        [Op.lt]: new Date() 
                    }
                },
                returning: true, 
            });

            if (affectedRowCount > 0 && updatedSeats && updatedSeats.length > 0) {
                console.log(`Background cleanup: Released ${affectedRowCount} expired seats`);

                updatedSeats.forEach((seat: any) => {
                    broadcastMessage(seat.flightId, {
                        type: 'seatReleased',
                        seatId: seat.id,
                        userId: null,
                        status: 'available',
                        flightId: seat.flightId,
                        timestamp: new Date()
                    });
                });
            }
        } catch (error) {
            console.error('Background seat cleanup failed:', error);
        }
    });
};

export const getAllFlightsDB = async () => {
    cleanupExpiredSeats();
               
        const flights = await Flights.findAll(
            {
                include: [{
                    model: Seat,
                    as: 'seats',
                    attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price'
                        ,
                        [
                    sequelizer.literal(`
                        CASE 
                            WHEN status = 'reserved' AND lock_expiry < NOW() THEN 'available'
                            ELSE status 
                        END
                    `),
                    'status' 
                ],
                [
                    sequelizer.literal(`
                        CASE 
                            WHEN "status" = 'reserved' AND "lock_expiry" < NOW() THEN NULL
                            ELSE "locked_by" 
                        END
                    `),
                    'locked_by'
                ],
                [
                    sequelizer.literal(`
                        CASE 
                            WHEN "status" = 'reserved' AND "lock_expiry" < NOW() THEN NULL
                            ELSE "lock_expiry" 
                        END
                    `),
                    'lock_expiry'
                ]
                    ]
                }]
            }
        );
        if (!flights || flights.length === 0) {
            throw new NotFoundError('No flights found');
        }
        return flights;
    
}

export const getFlightByIdDB = async (flightId: string) => {
    cleanupExpiredSeats();
   
        const flight = await Flights.findOne({
            where: { id: flightId },
            include: [{
                model: Seat,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price', 
                    [
                    sequelizer.literal(`
                        CASE 
                            WHEN status = 'reserved' AND lock_expiry < NOW() THEN 'available'
                            ELSE status 
                        END
                    `),
                    'status' 
                ],
                [
                    sequelizer.literal(`
                        CASE 
                            WHEN "status" = 'reserved' AND "lock_expiry" < NOW() THEN NULL
                            ELSE "locked_by" 
                        END
                    `),
                    'locked_by'
                ],
                [
                    sequelizer.literal(`
                        CASE 
                            WHEN "status" = 'reserved' AND "lock_expiry" < NOW() THEN NULL
                            ELSE "lock_expiry" 
                        END
                    `),
                    'lock_expiry'
                ]
                ],
                
            }]
        });
        
        if (!flight) {
            throw new NotFoundError(`Flight with number ${flightId} not found`);
        }
        return flight.toJSON() as FlightAttributes;
   
}

export const createFlightDB = async (userId: number, flightData: FlightCreationAttributes) => {

        const user = await Users.findByPk(userId);
        if (!user || user.role !== 'admin') {   
            throw new AuthorizationError('Only admins can create flights');
        }

        const flight = await Flights.create(flightData,{
            include: [{
                model: Seat,
                as: 'seats',
                attributes: ['id', 'seatNumber', 'seat_class', 'status', 'price',
                    
                ]
              }]
        });
        if (!flight) {
            throw new DatabaseError('Flight creation failed');
        }
        return flight;
   
}

export const handleFlightSearchDB = async (origin: string, destination: string, seat_class: string, date: string, sortBy = 'price') => {
    
    const whereClause: any = {};

    if (origin && origin.trim() !== '') {
        whereClause.origin = origin.toUpperCase();
    }
    if (destination && destination.trim() !== '') {
        whereClause.destination = destination.toUpperCase();
    }
    if (date && date.trim() !== '') {
        const searchDate = new Date(date);
        if (!isNaN(searchDate.getTime())) {
            const startOfDay = new Date(searchDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(searchDate);
            endOfDay.setHours(23, 59, 59, 999);

            whereClause.departureTime = {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay
            };
        }
    }

    const flights = await Flights.findAll({
        where: whereClause,
        include: [{
            model: Seat,
            as: 'seats',
            where: { status: 'available' },
            required: false,
            attributes: ['seat_class', 'price', 'status']
        }],
        order: sortBy === 'time' ? [['departureTime', 'ASC']] : [['id', 'ASC']],
    });

    let filteredFlights = flights;
    if (seat_class && seat_class !== 'any') {
        filteredFlights = flights.filter(flight => 
            flight.seats && flight.seats.some(seat => 
                seat.seat_class === seat_class && seat.status === 'available'
            )
        );
    }

    if (!flights || flights.length === 0) {
        return [];
        throw new NotFoundError('No flights found for the given criteria');
        
    }
    
    return flights;
}
