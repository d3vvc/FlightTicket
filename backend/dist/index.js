"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ErrorHandling_1 = require("./middleware/ErrorHandling");
const connectDB_1 = require("./config/connectDB");
const route_1 = __importDefault(require("./modules/auth/route"));
const route_2 = __importDefault(require("./modules/flights/route"));
const route_3 = __importDefault(require("./modules/seats/route"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const seatWebSocket_1 = require("./services/seatWebSocket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 8080;
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions_1.default));
const server = http_1.default.createServer(app);
(0, seatWebSocket_1.initializeSeatWebSocket)(server);
app.use('/api/auth', route_1.default);
app.use('/api/flights', route_2.default);
app.use('/api/seats', route_3.default);
app.use(ErrorHandling_1.errorHandler);
(0, connectDB_1.connectDB)()
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
