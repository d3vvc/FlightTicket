import { Sequelize } from 'sequelize';

export const sequelizer = new Sequelize('postgres', 'postgres', 'postgres', {
  host: '35.242.253.179',
  dialect: 'postgres',
  port: 5432
});





