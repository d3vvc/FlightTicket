import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/ErrorHandling';
import { connectDB } from './config/connectDB';
import authRoutes from './modules/auth/route';
import flightRoutes from './modules/flights/route';
import seatRoutes from './modules/seats/route';
import corsOptions from './config/corsOptions';
import http from 'http';
import dotenv from 'dotenv';
import { initializeSeatWebSocket } from './services/seatWebSocket';
import PollingService from './services/MailSender';

dotenv.config();
const app = express();
const PORT: number = 8080;

app.use(express.json());
app.use(cors(corsOptions));

const server = http.createServer(app);
initializeSeatWebSocket(server);

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/seats', seatRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
      console.log(`WebSocket for seat updates: ws://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Server not started due to DB connection error.');
    process.exit(1);
  });
