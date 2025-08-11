"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Flights extends sequelize_1.Model {
}
Flights.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    flightNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    airline: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    departureTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    arrivalTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    aircraftType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    totalSeats: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelizer,
    modelName: "Flights",
    tableName: "Flights",
});
exports.default = Flights;
