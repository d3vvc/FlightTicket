import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Search, ArrowRightLeft, Plane } from 'lucide-react';
import { Button } from '../UI/Button';
import { useFlights } from '../../hooks/useFlights';
import { useNavigate, useLocation } from 'react-router-dom';

export const FlightSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchParams, updateSearchParams, searchFlights, loading, error } = useFlights();
  
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      navigate('/flights');
    }
    
    await searchFlights();
  };

  const swapCities = () => {
    updateSearchParams({
      origin: searchParams.destination,
      destination: searchParams.origin,
    });
  };

  const popularDestinations = [
    { code: 'NYC', city: 'New York', country: 'USA' },
    { code: 'LON', city: 'London', country: 'UK' },
    { code: 'PAR', city: 'Paris', country: 'France' },
    { code: 'TOK', city: 'Tokyo', country: 'Japan' },
    { code: 'DUB', city: 'Dubai', country: 'UAE' },
    { code: 'SYD', city: 'Sydney', country: 'Australia' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 rounded-3xl shadow-2xl p-10 border border-gray-700 w-full"
    >
      <h2 className="text-4xl font-bold text-center mb-10 text-white">Search Flights</h2>

      <div className="flex space-x-4 mb-8 justify-center">
        <button
          onClick={() => {
            setTripType('oneWay');
            updateSearchParams({ tripType: 'oneWay' });
          }}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            tripType === 'oneWay'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
          }`}
        >
          One Way
        </button>
        <button
          onClick={() => {
            setTripType('roundTrip');
            updateSearchParams({ tripType: 'roundTrip' });
          }}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            tripType === 'roundTrip'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
          }`}
        >
          Round Trip
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-8 w-full">
        <div className="grid md:grid-cols-3 gap-6 w-full">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
              <input
                type="text"
                value={searchParams.origin}
                onChange={(e) => updateSearchParams({ origin: e.target.value })}
                placeholder="Departure city"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={swapCities}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-blue-500"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
              <input
                type="text"
                value={searchParams.destination}
                onChange={(e) => updateSearchParams({ destination: e.target.value })}
                placeholder="Destination city"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
              <input
                type="date"
                value={searchParams.departureDate}
                onChange={(e) => updateSearchParams({ departureDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-800 text-white"
              />
            </div>
          </div>

          {tripType === 'roundTrip' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Return</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                <input
                  type="date"
                  value={searchParams.returnDate}
                  onChange={(e) => updateSearchParams({ returnDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-800 text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
              <select
                value={searchParams.passengers}
                onChange={(e) => updateSearchParams({ passengers: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-800 text-white"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-300 mb-4">Class</label>
          <div className="grid grid-cols-4 gap-3 w-full">
            {['any', 'economy', 'business', 'first'].map(classType => (
              <button
                key={classType}
                type="button"
                onClick={() => updateSearchParams({ class: classType as any })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 capitalize font-medium ${
                  searchParams.class === classType
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500 bg-gray-800'
                }`}
              >
                {classType}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl w-full"
          >
            {error}
          </motion.div>
        )}

        <div className="text-center w-full">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="px-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Flights
          </Button>
        </div>
      </form>

      {/* <div className="mt-12 w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Popular Destinations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {popularDestinations.map(dest => (
            <motion.button
              key={dest.code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSearchParams({ destination: dest.code })}
              className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center border border-gray-700 hover:border-blue-500"
            >
              <Plane className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="font-semibold text-white text-sm">{dest.city}</div>
              <div className="text-xs text-gray-400">{dest.country}</div>
            </motion.button>
          ))}
        </div>
      </div> */}
    </motion.div>
  );
};
