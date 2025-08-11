import { useCallback } from 'react';
import { useFlightStore } from '../stores/flightStore';
import { flightService } from '../services/FlightService';
import { useNavigate } from 'react-router-dom';

export const useFlights = () => {
  const navigate = useNavigate();
  const {
    flights,
    selectedFlight,
    searchParams,
    loading,
    error,
    filters,
    setFlights,
    setSelectedFlight,
    updateSearchParams,
    setLoading,
    setError,
    updateFilters,
    clearFlights,
  } = useFlightStore();

  const getAllFlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const flights = await flightService.getAllFlights();
      setFlights(flights);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch flights');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, [setFlights, setLoading, setError]);

  const searchFlights = useCallback(async () => {
    if (!searchParams.origin && !searchParams.destination && !searchParams.departureDate) {
      return getAllFlights();
    }

    setLoading(true);
    setError(null);
    
    try {
      const flights = await flightService.searchFlightsBackend({
        origin: searchParams.origin || '',
        destination: searchParams.destination || '',
        seat_class: searchParams.class === 'any' ? 'economy' : searchParams.class,
        date: searchParams.departureDate,
        sortBy: 'time'
      });
      
      setFlights(flights);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search flights');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, setFlights, setLoading, setError, getAllFlights]);

  const getFlightDetails = useCallback(async (flightId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const flight = await flightService.getFlightById(flightId);
      setSelectedFlight(flight);
      return flight;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get flight details');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setSelectedFlight, setLoading, setError]);

  const getFlightById = useCallback(async (flightId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching flight by numberid:", flightId);
      const flight = await flightService.getFlightById(flightId);
      setSelectedFlight(flight);
      return flight;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get flight details');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setSelectedFlight, setLoading, setError]);

  const bookFlight = useCallback((flightId: string) => {
    navigate(`/seat-map/${flightId}`);
  }, [navigate]);

  const clearSearch = useCallback(() => {
    clearFlights();
    setError(null);
  }, [clearFlights, setError]);

  return {
    flights,
    selectedFlight,
    searchParams,
    loading,
    error,
    filters,
    updateSearchParams,
    updateFilters,
    getAllFlights,
    searchFlights,
    getFlightDetails,
    getFlightById,
    bookFlight,
    clearSearch,
    setSelectedFlight
  };
};
