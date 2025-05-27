import { DataTypes } from "sequelize";
import { sequelizer } from "../config/db.js";

const Flights = sequelizer.define("Flights", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    airline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    aircraftType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalSeats : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    

})

export default Flights;