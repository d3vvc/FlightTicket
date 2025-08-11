import { useAuthStore } from "../stores/authStore";

interface SeatUpdate {
  type: 'seatReserved' | 'seatReleased' | 'error';
  seatId?: number;
  userId?: number | null;
  status?: string;
  flightId?: number;
  timestamp?: Date;
  message?: string;
  success?: boolean;
  seat?: {
    id: number;
    seatNumber: string;
    flightId: number;
    status: string;
  };
}

type MessageHandler = (data: SeatUpdate) => void;

class WebSocketService {
    private ws: WebSocket | null = null;
    private messageHandlers: Set<MessageHandler> = new Set();
    private currentFlightId: number | null = null;

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8080');

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                resolve();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            this.ws.onmessage = (event) => {
                try {
                    const data: SeatUpdate = JSON.parse(event.data);
                    console.log('WebSocket message received:', data);
                    this.messageHandlers.forEach(handler => handler(data));
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            this.ws.onclose = () => {
                this.disconnect()
                this.ws = null;
                this.messageHandlers.clear();
            };
        });
    } 
     disconnect() {
   
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
    this.currentFlightId = null;
  }
   addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers.delete(handler);
  }

  watchFlight(flightId: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.currentFlightId = flightId;
      this.ws.send(JSON.stringify({
        type: 'watchFlight',
        flightId: flightId
      }));
    }
  }

  reserveSeat(seatId: number, userId: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'reserveSeat',
        seatId: seatId,
        userId: userId
      }));
    }
  }

  releaseSeat(seatId: number, userId: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'releaseSeat',
        seatId: seatId,
        userId: userId
      }));
    this.currentFlightId = null;

    }
  }
  unwatchFlight() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.currentFlightId) {
      this.ws.send(JSON.stringify({
        type: 'unwatchFlight',
        flightId: this.currentFlightId
      }));
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}



export const websocketService = new WebSocketService();
