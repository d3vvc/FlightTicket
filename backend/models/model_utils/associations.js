import Flights from "../Flights.js";
import Seat from "../Seat.js";
import Users from "../Users.js";

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

export { Flights, Seat, Users };