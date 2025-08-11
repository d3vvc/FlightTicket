"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.Seat = exports.Flights = void 0;
const Flights_1 = __importDefault(require("../Flights"));
exports.Flights = Flights_1.default;
const Seat_1 = __importDefault(require("../Seat"));
exports.Seat = Seat_1.default;
const Users_1 = __importDefault(require("../Users"));
exports.Users = Users_1.default;
const LoginAttempts_1 = __importDefault(require("../LoginAttempts"));
Flights_1.default.hasMany(Seat_1.default, {
    foreignKey: 'flightId',
    as: 'seats'
});
Seat_1.default.belongsTo(Flights_1.default, {
    foreignKey: 'flightId',
    as: 'flight'
});
Users_1.default.hasMany(Seat_1.default, {
    foreignKey: 'locked_by',
    as: 'lockedSeats'
});
Seat_1.default.belongsTo(Users_1.default, {
    foreignKey: 'locked_by',
    as: 'user'
});
Users_1.default.hasOne(LoginAttempts_1.default, {
    foreignKey: 'userId',
    as: 'loginAttempts'
});
LoginAttempts_1.default.belongsTo(Users_1.default, {
    foreignKey: 'userId',
    as: 'user'
});
