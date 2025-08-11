"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Seats extends sequelize_1.Model {
}
Seats.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    flightId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    seatNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    seat_class: {
        type: sequelize_1.DataTypes.ENUM('economy', 'business', 'first'),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('available', 'reserved', 'booked'),
        defaultValue: 'available',
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    locked_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    lock_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: db_1.sequelizer,
    modelName: "Seats",
    tableName: "Seats",
});
exports.default = Seats;
