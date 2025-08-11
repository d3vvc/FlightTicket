import {sequelizer} from './db';



export const connectDB = async () => {
    try {
      await sequelizer.authenticate();
      await sequelizer.sync();
      console.log('PostgreSQL connected');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };
  