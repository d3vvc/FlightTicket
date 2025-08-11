import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Filter,
  ArrowRight,
  Wifi,
  Coffee,
  Monitor,
  ArrowUp,
  Calendar
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { FlightSearch } from '../components/Flights/FlightSearch';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useFlights } from '../hooks/useFlights';
import { flightService } from '../services/FlightService';

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

export const FlightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { 
    flights, 
    loading, 
    error, 
    filters,
    getAllFlights,
    bookFlight,
  } = useFlights();

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'airline'>('time');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    getAllFlights();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const searchSectionHeight = 300;
      setShowScrollTop(scrollTop > searchSectionHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleBookFlight = (flight: Flight) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }   
    const flightIdString = flight.id.toString();
    bookFlight(flightIdString);
  };

  const filteredAndSortedFlights = React.useMemo(() => {
    let filtered = [...flights];

    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        filters.airlines.includes(flight.airline)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        case 'airline':
          return a.airline.localeCompare(b.airline);
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Airline POC
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
              >
                Home
              </button>
              <span className="text-blue-400 font-medium">Flights</span>
            
            </nav>

            <div className="flex items-center space-x-4">
              {!isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FlightSearch />
        </div>
      </section>

      <section className="py-6 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredAndSortedFlights.length} Flights Found
            </h2>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="time">Sort by Time</option>
                <option value="airline">Sort by Airline</option>
              </select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="pb-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Loading flights...</p>
            </div>
          ) : filteredAndSortedFlights.length === 0 ? (
            <div className="text-center py-12">
              <Plane className="h-24 w-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No flights found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedFlights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {flight.airline}
                      </h3>
                      <p className="text-gray-400 text-sm">{flight.flightNumber}</p>
                      <p className="text-gray-400 text-sm">{flight.aircraftType}</p>
                      <div className="flex items-center mt-2">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-400 text-xs">
                          {formatDate(flight.departureTime)}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">
                            {flightService.formatTime(flight.departureTime)}
                          </p>
                          <p className="text-gray-400 text-sm">{flight.origin}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {formatDate(flight.departureTime)}
                          </p>
                        </div>
                        
                        <div className="flex-1 mx-4">
                          <div className="relative">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600"></div>
                            <div className="relative flex justify-center">
                              <Plane className="h-5 w-5 text-blue-400 bg-gray-800 px-1" />
                            </div>
                          </div>
                          <p className="text-center text-gray-400 text-xs mt-2">
                            {flightService.formatDuration(flight.departureTime, flight.arrivalTime)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">
                            {flightService.formatTime(flight.arrivalTime)}
                          </p>
                          <p className="text-gray-400 text-sm">{flight.destination}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {formatDate(flight.arrivalTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex justify-center space-x-3 text-gray-400">
                        <Wifi className="h-5 w-5" />
                        <Coffee className="h-5 w-5" />
                        <Monitor className="h-5 w-5" />
                      </div>
                      <p className="text-center text-gray-400 text-sm mt-2">
                        {flightService.getAvailableSeats(flight.seats, flight.totalSeats)} seats left
                      </p>
                    </div>

                    <div className="md:col-span-3 text-center">
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-blue-400">
                          ${flightService.getLowestPrice(flight.seats)}
                        </span>
                        <p className="text-gray-400 text-sm">per person</p>
                      </div>
                      
                      <Button
                        onClick={() => handleBookFlight(flight)}
                        variant="primary"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={flightService.getAvailableSeats(flight.seats, flight.totalSeats) === 0}
                      >
                        {flightService.getAvailableSeats(flight.seats, flight.totalSeats) === 0 ? 'Sold Out' : 'Book Flight'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl z-50"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
};
