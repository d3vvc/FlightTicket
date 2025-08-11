import { DataTypes, Model } from "sequelize";
import { sequelizer } from "../config/db";
import { SeatAttributes, SeatCreationAttributes, FlightAttributes, UserAttributes } from "../types/index";

class Seats extends Model<SeatAttributes, SeatCreationAttributes> implements SeatAttributes {
  public id!: number;
  public flightId!: number;
  public seatNumber!: string;
  public seat_class!: 'economy' | 'business' | 'first';
  public status!: 'available' | 'reserved' | 'booked';
  public price!: number;
  public locked_by!: number | null;
  public lock_expiry!: Date | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public user?: UserAttributes;
  public flight?: FlightAttributes;
}

Seats.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  flightId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seat_class: {
    type: DataTypes.ENUM('economy', 'business', 'first'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'reserved', 'booked'),
    defaultValue: 'available',
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  locked_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lock_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize: sequelizer,
  modelName: "Seats",
  tableName: "Seats",
});

export default Seats;