import {WebSocketServer, WebSocket} from 'ws';
import { reserveSeatDB, releaseSeatDB } from '../modules/seats/service';
import { Server } from 'node:http';
import { Console } from 'node:console';

interface FlightClient extends WebSocket {
    flightId?: number;  
}

interface baseMessage {
    type: string
}

interface watchFlightMessage extends baseMessage {
    type: 'watchFlight';
    flightId: number;
}

interface reserveSeatMessage extends baseMessage {
    type: 'reserveSeat';
    seatId: number;
    userId: number;
}

interface releaseSeatMessage extends baseMessage {
    type: 'releaseSeat';
    seatId: number;
    userId: number;
}

interface seatUpdateMessage extends baseMessage {
    type: 'seatReserved' | 'seatReleased';
    seatId: number;
    userId: number | null;  
    status: string;
    flightId: number;
    timestamp: Date;
    locked_until?: Date | null;
}

interface seatReservedMessage extends baseMessage {
    type: 'seatReserved';
    success: boolean;
    seat: {
        id: number;
        seatNumber: string;
        flightId: number;
        status: string;
    };
}

interface seatReleasedMessage extends baseMessage {
    type: 'seatReleased';
    success: boolean;
    seat: {
        id: number;
        seatNumber: string;
        flightId: number;
        status: string;
    };
}

let wss: WebSocketServer;
const flightClients = new Map<number, Set<FlightClient>>();

export const initializeSeatWebSocket = (server: Server): WebSocketServer => {
    wss = new WebSocketServer({ server });
    wss.on('connection', (ws: FlightClient) => {
        console.log('New client connected');

        ws.on('message', (message: Buffer) => {
            try {
             const data = JSON.parse(message.toString())
             console.log('Received message:', data);
     
             if (data.type === 'watchFlight') {
                 ws.flightId = data.flightId;
     
                 if (!flightClients.has(data.flightId)) {
                     flightClients.set(data.flightId, new Set());
                 }
                 flightClients.get(data.flightId)?.add(ws);
             }
             else if (data.type === 'unwatchFlight') {
            if (ws.flightId && flightClients.has(ws.flightId)) {
                flightClients.get(ws.flightId)?.delete(ws);
                if (flightClients.get(ws.flightId)?.size === 0) {
                    flightClients.delete(ws.flightId);
                }
                // console.log(`Client stopped watching flight ${ws.flightId}`);
                // console.log(flightClients)
                ws.flightId = undefined; 
            }
        }
                else if (data.type === 'reserveSeat') {
                    handleSeatReserve(ws, data);
                } else if (data.type === 'releaseSeat') {
                    handleSeatRelease(ws, data);
                } 
               
            } catch (error) {
             console.error('Error parsing message:', error);
            }
         })

         ws.on('close', () => {
             if (ws.flightId && flightClients.has(ws.flightId)) {
                 flightClients.get(ws.flightId)?.delete(ws);
                 if (flightClients.get(ws.flightId)?.size === 0) {
                     flightClients.delete(ws.flightId);
                 }
                 console.log(`Client disconnected from flight ${ws.flightId}`);
             }
         })
    })
    return wss;

    
}

export const broadcastMessage = (flightId: number, seatData: seatUpdateMessage) => {
    if (!flightClients.has(flightId)) {
        return;
    }

    const message = JSON.stringify({
        ...seatData,
    }
    )

    if (flightClients.has(flightId)) {
        flightClients.get(flightId)?.forEach((client) => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    }
    console.log(`Broadcasted seat update to ${flightClients.get(flightId)?.size} clients for flight ${flightId}`);
}


const handleSeatReserve = async (ws: WebSocket, data: reserveSeatMessage) => {
    try{
        const { seatId, userId } = data;
        
        const seat = await reserveSeatDB(seatId, userId);
        if (!seat) {
            ws.send(JSON.stringify({ type: 'error', message: 'Seat not found or already reserved' }));
            return;
        }

        const successMsg: seatReservedMessage = {
            type: 'seatReserved',
            success: true,
            seat: {
                id: seat.id,
                seatNumber: seat.seatNumber,
                flightId: seat.flightId,
                status: seat.status,
            }}
        ws.send(JSON.stringify(successMsg));

        broadcastMessage(seat.flightId, {
            type: 'seatReserved',
            seatId: seat.id,
            userId: seat.locked_by,
            status: seat.status,
            flightId: seat.flightId,
             locked_until: seat.lock_expiry,
            timestamp: new Date()
        })

    } catch (error) {
        console.error('Error handling seat reservation:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Could not reserve seat' }));
    }
 }


 const handleSeatRelease = async (ws: WebSocket, data: releaseSeatMessage) => {
    try {
        const { seatId, userId } = data;

        const seat = await releaseSeatDB(seatId, userId);
        if (!seat) {
            ws.send(JSON.stringify({ type: 'error', message: 'Seat not found or not reserved by this user' }));
            return;
        }

       const successMsg: seatReleasedMessage = {    
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

        broadcastMessage(seat.flightId, {
            type: 'seatReleased',
            seatId: seat.id,
            userId: null,
            status: seat.status,
            flightId: seat.flightId,
            locked_until: seat.lock_expiry,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error handling seat release:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Could not release seat' }));
    }
 }