import { DataTypes } from "sequelize";
import { sequelizer } from "../config/db.js";

const Seat = sequelizer.define("Seat", {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Flights',
            key: 'id'
        }
    },
    seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },seat_class: {
        type: DataTypes.ENUM('economy', 'business', 'first'),
        defaultValue: 'economy'
      },
      status: {
        type: DataTypes.ENUM('available', 'reserved', 'booked'),
        defaultValue: 'available'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      locked_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      lock_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      }
})

export default Seat;