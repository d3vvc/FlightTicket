import Flights from "../Flights.js";
import Seat from "../Seat.js";
import Users from "../Users.js";
import LoginAttempts from '../LoginAttempts.js';


Flights.hasMany(Seat, {
    foreignKey: 'flightId',
    as: 'seats'
})
Seat.belongsTo(Flights, {
    foreignKey: 'flightId',
    as: 'flight'
});
Users.hasMany(Seat, {
    foreignKey: 'locked_by',
    as: 'lockedSeats'
});
Seat.belongsTo(Users, {
    foreignKey: 'locked_by',
    as: 'user'
});
Users.hasOne(LoginAttempts, { 
    foreignKey: 'userId',
    as: 'loginAttempts'
});

LoginAttempts.belongsTo(Users, { 
    foreignKey: 'userId',
    as: 'user'
});

export { Flights, Seat, Users };