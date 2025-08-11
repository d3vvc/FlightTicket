// types/flight.ts
export interface Seat {
  id: number;
  seatNumber: string;
  seat_class: 'economy' | 'business' | 'first';
  status: 'available' | 'reserved' | 'booked';
  price: number;
}

export interface SeatData extends Seat {
  flightId: number;
  locked_by: number | null;
  lock_expiry: Date | null;
}

export interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftType: string;
  totalSeats: number;
  seats?: Seat[];
}
