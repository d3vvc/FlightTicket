import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/ErrorHandling.js';
import { connectDB } from './config/connectDB.js';
import authRoutes from './modules/auth/route.js';
import flightRoutes from './modules/flights/route.js';
import seatRoutes from './modules/seats/route.js';
import corsOptions from './config/corsOptions.js';
import http from 'http';
import { initializeSeatWebSocket } from './services/seatWebSocket.js';


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors(corsOptions));

const server = http.createServer(app);
initializeSeatWebSocket(server);

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/seats', seatRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
      console.log(`WebSocket for seat updates: ws://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Server not started due to DB connection error.');
    process.exit(1);
  });
