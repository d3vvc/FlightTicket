// stores/flightStore.ts
import { create } from 'zustand';

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

interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
  class: 'economy' | 'business' | 'first' | 'any';
}

interface FlightState {
  flights: Flight[];
  selectedFlight: Flight | null;
  searchParams: SearchParams;
  loading: boolean;
  error: string | null;
  filters: {
    priceRange: [number, number];
    airlines: string[];
    departureTime: string[];
  };
}

interface FlightActions {
  setFlights: (flights: Flight[]) => void;
  setSelectedFlight: (flight: Flight | null) => void;
  updateSearchParams: (params: Partial<SearchParams>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFilters: (filters: Partial<FlightState['filters']>) => void;
  clearFlights: () => void;
}

type FlightStore = FlightState & FlightActions;

export const useFlightStore = create<FlightStore>((set) => ({
  flights: [],
  selectedFlight: null,
  searchParams: {
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'oneWay',
    class: 'any',
  },
  loading: false,
  error: null,
  filters: {
    priceRange: [0, 2000],
    airlines: [],
    departureTime: [],
  },

  setFlights: (flights) => set({ flights }),
  setSelectedFlight: (selectedFlight) => set({ selectedFlight }),
  updateSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  clearFlights: () => set({ flights: [], selectedFlight: null }),
}));
