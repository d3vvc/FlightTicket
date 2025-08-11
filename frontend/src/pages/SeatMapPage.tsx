// pages/SeatMapPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plane, 
  ArrowLeft, 
  Wifi, 
  Coffee, 
  Monitor,
  
  CreditCard,
  Calendar
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Seat } from '../components/SeatMap/Seat';
import { useSeatWebSocket } from '../hooks/useSeatWebSocket';
import { useAuthStore } from '../stores/authStore';
import { useFlights } from '../hooks/useFlights'; 
import { flightService } from '../services/FlightService';
import { useFlightStore } from '../stores/flightStore';

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
    locked_by?: number | null;
    lock_expiry?: Date | null;
  }>;
}

interface SeatData {
  id: number;
  flightId: number;
  seatNumber: string;
  seat_class: 'economy' | 'business' | 'first';
  status: 'available' | 'reserved' | 'booked';
  price: number;
  locked_by: number | null;
  lock_expiry: Date | null;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

export const SeatMapPage: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  // const { flights } = useFlights();
  const { flights } = useFlightStore();
  
  const [flight, setFlight] = useState<Flight | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [flightError, setFlightError] = useState<string | null>(null);
  const { getFlightById } = useFlights();

  const {
    isConnected,
    seats,
    setSeats,
    error: wsError,
    setError: setWsError,
    reserveSeat,
    releaseSeat
  } = useSeatWebSocket(flight?.id || 0);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (flightId) {
        try {
          setLoading(true);
          setFlightError(null); 
          
          const flight = await getFlightById(flightId);
          setFlight(flight);
        } catch (error) {
          setFlightError(error instanceof Error ? error.message : 'Failed to load flight');
        } finally {
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    };

    fetchFlight();
  }, [flightId, isAuthenticated, navigate, getFlightById]);

  // const findFlightInStore = () => {
  //   try {
  //     setLoading(true);
  //     setFlightError(null);
      
  //     if (!flightNumber) {
  //       throw new Error('Flight number is required');
  //     }
      
  //     const foundFlight = flights.find(f => f.flightNumber === flightNumber);
      
  //     if (!foundFlight) {
  //       throw new Error(`Flight ${flightNumber} not found. Please go back to flights page and try again.`);
  //     }
      
      // setFlight(foundFlight);
  //   } catch (err) {
  //     setFlightError(err instanceof Error ? err.message : 'Failed to load flight');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (flight && isConnected) {
      if (flight.seats && flight.seats.length > 0) {
        const transformedSeats: SeatData[] = flight.seats.map(seat => ({
          ...seat,
          flightId: flight.id,
          locked_by: seat.locked_by ?? null,
        lock_expiry: seat.lock_expiry ?? null
        }));
        // for (const seat of flight.seats) {
        //   console.log(`Seat ${seat.seatNumber} - Status: ${seat.status}, Locked By: ${seat.locked_by}`);
        // }
        setSeats(transformedSeats);
      } else {
        setFlightError('No seat data available for this flight');
      }
    }
  }, [flight, isConnected, setSeats]);

  const handleSeatClick = (seat: SeatData) => {
    if (!user) return;

    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id);
    const isMyReservation = seat.locked_by === user.id;

    if (isAlreadySelected || isMyReservation) {
      releaseSeat(seat.id);
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else if (seat.status === 'available') {
      reserveSeat(seat.id);
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const groupSeatsByRow = (seats: SeatData[]) => {
    const grouped: { [key: string]: SeatData[] } = {};
    
    seats.forEach(seat => {
      const row = seat.seatNumber.replace(/[A-Z]/g, '');
      if (!grouped[row]) {
        grouped[row] = [];
      }
      grouped[row].push(seat);
    });

    Object.keys(grouped).forEach(row => {
      grouped[row].sort((a, b) => 
        a.seatNumber.localeCompare(b.seatNumber)
      );
    });

    return grouped;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      setWsError('Please select at least one seat');
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        flight, 
        selectedSeats,
        totalPrice: getTotalPrice()
      }
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          {/* <p className="text-gray-300">Loading flight {flightNumber}...</p> */}
          <p className="text-gray-500 text-sm mt-2">Getting flight data</p>
        </div>
      </div>
    );
  }

  if (flightError || !flight) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{flightError || 'Flight not found'}</p>
          <p className="text-gray-400 text-sm mb-4">
            Make sure to navigate from the flights page to ensure flight data is loaded.
          </p>
          <Button onClick={() => navigate('/flights')} variant="outline">
            Back to Flights
          </Button>
        </div>
      </div>
    );
  }

  if (!seats || seats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-400 mb-4">No seat map available for this flight</p>
          <p className="text-gray-400 text-sm mb-4">
            Seat selection is not available for flight {flight.flightNumber}
          </p>
          <Button onClick={() => navigate('/flights')} variant="outline">
            Back to Flights
          </Button>
        </div>
      </div>
    );
  }

  const groupedSeats = groupSeatsByRow(seats);
  const sortedRows = Object.keys(groupedSeats).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/flights')}
                className="mr-4 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-white">
                  Select Seats - {flight.airline} {flight.flightNumber}
                </h1>
                <p className="text-gray-400 text-sm">
                  {flight.origin} → {flight.destination}
                </p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-gray-400 text-xs">
                    {formatDate(flight.departureTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-xs ${
                isConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {wsError && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 mx-4 mt-4 rounded-lg">
          {wsError}
          <button 
            onClick={() => setWsError(null)}
            className="ml-4 text-red-200 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4 text-center">
                  <h2 className="text-2xl font-bold text-white">{flight.aircraftType}</h2>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mt-2">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 mr-1" />
                      WiFi
                    </div>
                    <div className="flex items-center">
                      <Coffee className="h-4 w-4 mr-1" />
                      Meals
                    </div>
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-1" />
                      Entertainment
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-6 mb-8">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                  First Class
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  Business
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  Economy
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                  Occupied
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
                  Reserved
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sortedRows.map(rowNumber => {
                  const rowSeats = groupedSeats[rowNumber];
                  const seatClass = rowSeats[0]?.seat_class;
                  
                  return (
                    <div key={rowNumber} className="flex items-center justify-center space-x-1">
                      <div className="w-8 text-center text-gray-400 text-sm font-mono">
                        {rowNumber}
                      </div>
                      
                      <div className="flex space-x-1">
                        {rowSeats.map((seat, index) => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          const isMyReservation = seat.locked_by === user?.id;
                          
                          const showAisle = (seatClass === 'first' || seatClass === 'business') 
                            ? index === 1 
                            : index === 2;
                          
                          return (
                            <React.Fragment key={seat.id}>
                              <Seat
                                id={seat.id}
                                seatNumber={seat.seatNumber}
                                seatClass={seat.seat_class}
                                status={seat.status}
                                price={seat.price}
                                lockedBy={seat.locked_by}
                                isSelected={isSelected}
                                isMyReservation={isMyReservation}
                                onClick={() => handleSeatClick(seat)}
                              />
                              {showAisle && <div className="w-4" />}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Flight Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Flight</span>
                  <span className="text-white font-mono">{flight.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Route</span>
                  <span className="text-white">{flight.origin} → {flight.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Departure</span>
                  <div className="text-right">
                    <div className="text-white">
                      {flightService.formatTime(flight.departureTime)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(flight.departureTime)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Arrival</span>
                  <div className="text-right">
                    <div className="text-white">
                      {flightService.formatTime(flight.arrivalTime)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(flight.arrivalTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">
                Selected Seats ({selectedSeats.length})
              </h3>
              
              {selectedSeats.length === 0 ? (
                <p className="text-gray-400 text-sm">No seats selected</p>
              ) : (
                <div className="space-y-3">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between items-center">
                      <div>
                        <span className="text-white font-mono">{seat.seatNumber}</span>
                        <span className="text-gray-400 text-sm ml-2 capitalize">
                          {seat.seat_class}
                        </span>
                      </div>
                      <span className="text-blue-400 font-bold">${seat.price}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-blue-400 font-bold text-xl">
                        ${getTotalPrice()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleProceedToCheckout}
              variant="primary"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={selectedSeats.length === 0}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
