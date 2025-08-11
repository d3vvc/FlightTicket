import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, Users } from 'lucide-react';
import { Button } from '../UI/Button';
import { useFlights } from '../../hooks/useFlights';
import { flightService } from '../../services/flightService';

export const FlightResults: React.FC = () => {
  const { flights, loading, error, selectedFlight, setSelectedFlight } = useFlights();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching for flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Found {flights.length} flights
      </h2>
      
      <div className="space-y-4">
        {flights.map((flight) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {flightService.formatTime(flight.departureTime)}
                    </div>
                    <div className="text-sm text-gray-600">{flight.origin}</div>
                  </div>
                  
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{flightService.formatDuration(flight.departureTime, flight.arrivalTime)}</span>
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                    <div className="text-xs text-gray-500">{flight.airline}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {flightService.formatTime(flight.arrivalTime)}
                    </div>
                    <div className="text-sm text-gray-600">{flight.destination}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{flightService.getAvailableSeats(flight.seats, flight.totalSeats)} seats left</span>
                  </div>
                  <div>{flight.aircraftType}</div> {/* Changed from aircraft to aircraftType */}
                  <div>{flight.totalSeats} total seats</div> {/* Added total seats info */}
                </div>
              </div>
              
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-blue-600">
                  ${flightService.getLowestPrice(flight.seats)}
                </div>
                <div className="text-sm text-gray-600 mb-2">per person</div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setSelectedFlight(flight)}
                  disabled={flightService.getAvailableSeats(flight.seats, flight.totalSeats) === 0}
                >
                  {flightService.getAvailableSeats(flight.seats, flight.totalSeats) === 0 ? 'Sold Out' : 'Select Flight'}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
