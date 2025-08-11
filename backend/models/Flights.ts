import { DataTypes, Model } from "sequelize";
import { sequelizer } from "../config/db";
import { FlightAttributes, FlightCreationAttributes } from "../types/index";

class Flights extends Model<FlightAttributes, FlightCreationAttributes> implements FlightAttributes {
   public id!: number;
  public flightNumber!: string;
  public airline!: string;
  public origin!: string;
  public destination!: string;  
  public departureTime!: Date;
  public arrivalTime!: Date;
  public aircraftType!: string;
  public totalSeats!: number;
  
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
public seats?: any[]
}

Flights.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
        allowNull: true, 
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    }, {
    sequelize: sequelizer,
    modelName: "Flights",
    tableName: "Flights",
})
export default Flights;