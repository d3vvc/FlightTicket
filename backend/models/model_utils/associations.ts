import Flights from "../Flights";
import Seat from "../Seat";
import Users from "../Users";
import LoginAttempts from '../LoginAttempts';


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