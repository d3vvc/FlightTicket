// hooks/useSeatWebSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { websocketService } from '../services/websocketSerive';
import { useAuthStore } from '../stores/authStore';

interface Seat {
  id: number;
  flightId: number;
  seatNumber: string;
  seat_class: 'economy' | 'business' | 'first';
  status: 'available' | 'reserved' | 'booked';
  price: number;
  locked_by: number | null;
  lock_expiry: Date | null;
}

export const useSeatWebSocket = (flightId: number) => {
  const [isConnected, setIsConnected] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'seatReserved' && data.seatId && data.status) {
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === data.seatId 
            ? { ...seat, status: data.status as any, locked_by: data.userId || null }
            : seat
        )
      );
    } else if (data.type === 'seatReleased' && data.seatId && data.status) {
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === data.seatId 
            ? { ...seat, status: data.status as any, locked_by: null }
            : seat
        )
      );
    } else if (data.type === 'error') {
      setError(data.message || 'An error occurred');
    }
  }, []);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        if (!websocketService.isConnected()) {
          await websocketService.connect();
        }
        setIsConnected(true);
        
        websocketService.watchFlight(flightId);
        
        websocketService.addMessageHandler(handleMessage);
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setError('Connection failed');
        setIsConnected(false);
      }
    };

    if (flightId) { 
      initializeConnection();
    }

    return () => {
      websocketService.unwatchFlight();
      websocketService.removeMessageHandler(handleMessage);
    };
  }, [flightId]);

  const reserveSeat = useCallback((seatId: number) => {
    if (user && websocketService.isConnected()) { 
      websocketService.reserveSeat(seatId, user.id);
    }
  }, [user]);

  const releaseSeat = useCallback((seatId: number) => {
    if (user && websocketService.isConnected()) {
      websocketService.releaseSeat(seatId, user.id);
    }
  }, [user]);

  return {
    isConnected,
    seats,
    setSeats,
    error,
    setError,
    reserveSeat,
    releaseSeat
  };
};
