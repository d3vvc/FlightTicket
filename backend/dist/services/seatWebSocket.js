"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastMessage = exports.initializeSeatWebSocket = void 0;
const ws_1 = require("ws");
const service_1 = require("../modules/seats/service");
let wss;
const flightClients = new Map();
const initializeSeatWebSocket = (server) => {
    wss = new ws_1.WebSocketServer({ server });
    wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'watchFlight') {
                    ws.flightId = data.flightId;
                    if (!flightClients.has(data.flightId)) {
                        flightClients.set(data.flightId, new Set());
                    }
                    flightClients.get(data.flightId)?.add(ws);
                }
                else if (data.type === 'reserveSeat') {
                    handleSeatReserve(ws, data);
                }
                else if (data.type === 'releaseSeat') {
                    handleSeatRelease(ws, data);
                }
            }
            catch (error) {
                console.error('Error parsing message:', error);
            }
        });
        ws.on('close', () => {
            if (ws.flightId && flightClients.has(ws.flightId)) {
                flightClients.get(ws.flightId)?.delete(ws);
                if (flightClients.get(ws.flightId)?.size === 0) {
                    flightClients.delete(ws.flightId);
                }
            }
        });
    });
    return wss;
};
exports.initializeSeatWebSocket = initializeSeatWebSocket;
const broadcastMessage = (flightId, seatData) => {
    if (!flightClients.has(flightId)) {
        return;
    }
    const message = JSON.stringify({
        ...seatData,
    });
    if (flightClients.has(flightId)) {
        flightClients.get(flightId)?.forEach((client) => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    }
    console.log(`Broadcasted seat update to ${flightClients.get(flightId)?.size} clients for flight ${flightId}`);
};
exports.broadcastMessage = broadcastMessage;
const handleSeatReserve = async (ws, data) => {
    try {
        const { seatId, userId } = data;
        const seat = await (0, service_1.reserveSeatDB)(seatId, userId);
        if (!seat) {
            ws.send(JSON.stringify({ type: 'error', message: 'Seat not found or already reserved' }));
            return;
        }
        const successMsg = {
            type: 'seatReserved',
            success: true,
            seat: {
                id: seat.id,
                seatNumber: seat.seatNumber,
                flightId: seat.flightId,
                status: seat.status,
            }
        };
        ws.send(JSON.stringify(successMsg));
        (0, exports.broadcastMessage)(seat.flightId, {
            type: 'seatReserved',
            seatId: seat.id,
            userId: seat.locked_by,
            status: seat.status,
            flightId: seat.flightId,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Error handling seat reservation:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Could not reserve seat' }));
    }
};
const handleSeatRelease = async (ws, data) => {
    try {
        const { seatId, userId } = data;
        const seat = await (0, service_1.releaseSeatDB)(seatId, userId);
        if (!seat) {
            ws.send(JSON.stringify({ type: 'error', message: 'Seat not found or not reserved by this user' }));
            return;
        }
        const successMsg = {
            type: 'seatReleased',
            success: true,
            seat: {
                id: seat.id,
                seatNumber: seat.seatNumber,
                flightId: seat.flightId,
                status: seat.status
            }
        };
        ws.send(JSON.stringify(successMsg));
        (0, exports.broadcastMessage)(seat.flightId, {
            type: 'seatReleased',
            seatId: seat.id,
            userId: null,
            status: seat.status,
            flightId: seat.flightId,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Error handling seat release:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Could not release seat' }));
    }
};
