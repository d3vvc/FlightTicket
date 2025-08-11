import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME: string = process.env.DB_NAME || 'airline_booking';
const DB_USER: string = process.env.DB_USER || 'postgres';
const DB_PASSWORD: string = process.env.DB_PASSWORD || 'postgres';
const DB_HOST: string = process.env.DB_HOST || 'localhost'; 
const DB_PORT: number = parseInt(process.env.DB_PORT || '5432');

export const sequelizer = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
