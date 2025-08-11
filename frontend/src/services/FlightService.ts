// services/flightService.ts
interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
  class: 'economy' | 'business' | 'first' | 'any';
}

// Interface matching your backend schema exactly
interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftType: string;
  totalSeats: number;
  seats?: Array<{
    id: number;
    seatNumber: string;
    seat_class: 'economy' | 'business' | 'first';
    status: 'available' | 'reserved' | 'booked';
    price: number;
  }>;
}

const API_BASE = 'http://localhost:8080/api';

export const flightService = {
  async searchFlights(params: SearchParams): Promise<Flight[]> {
    const response = await fetch(`${API_BASE}/flights/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to search flights');
    }
    
    const data = await response.json();
    return data.flights || data;
  },

 async getFlightById(flightId: string): Promise<Flight> {
  console.log("Fetching flight by ID:", flightId);
  const response = await fetch(`${API_BASE}/flights/get/${flightId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  
  if (!response.ok) {
    throw new Error('Failed to get flight details');
  }
  
  try {
    const data = await response.json();
    return data.flight; 
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new Error('Failed to parse flight data');
  }
}
,

  async getPopularDestinations(): Promise<Array<{code: string; city: string; country: string}>> {
    const response = await fetch(`${API_BASE}/flights/destinations/popular`);
    
    if (!response.ok) {
      throw new Error('Failed to get popular destinations');
    }
    
    return response.json();
  },

  async getAllFlights(): Promise<Flight[]> {
    const response = await fetch(`${API_BASE}/flights/get`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch flights');
    }
    
    const data = await response.json();
    return data.flights || [];
  },

  async getFlightByNumber(flightNumber: string): Promise<Flight> {
    const response = await fetch(`${API_BASE}/flights/${flightNumber}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get flight details');
    }
    
    const data = await response.json();
    return data.flight;
  },

  async searchFlightsBackend(params: {
    origin: string;
    destination: string;
    seat_class: string;
    date: string;
    sortBy?: string;
  }): Promise<Flight[]> {
    const response = await fetch(`${API_BASE}/flights/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to search flights');
    }
    const data = await response.json();
    return data.flights || [];
  },

  getLowestPrice(seats?: Flight['seats']): number {
    if (!seats || seats.length === 0) return 299;
    return Math.min(...seats.map(seat => seat.price));
  },

  getAvailableSeats(seats?: Flight['seats'], totalSeats?: number): number {
    if (seats) {
      return seats.filter(seat => seat.status === 'available').length;
    }
    return totalSeats ? Math.floor(totalSeats * 0.7) : 0;
  },

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  formatDuration(departure: string, arrival: string): string {
    const depTime = new Date(departure);
    const arrTime = new Date(arrival);
    const duration = (arrTime.getTime() - depTime.getTime()) / (1000 * 60 * 60);
    return `${Math.floor(duration)}h ${Math.round((duration % 1) * 60)}m`;
  }
  
};
