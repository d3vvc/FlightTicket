import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Star,
  ArrowRight,
  Shield,
  Clock,
  Globe,
  Search,
  MapPin
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { FlightSearch } from '../components/Flights/FlightSearch';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useFlights } from '../hooks/useFlights';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { updateSearchParams } = useFlights();

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Search",
      description: "Find the best flights with our intelligent search algorithm"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Global Destinations",
      description: "Fly to over 500 destinations worldwide"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Booking",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Get help whenever you need it, day or night"
    }
  ];

  const destinations = [
    { city: "Paris", country: "France", image: "🇫🇷", price: "$599" },
    { city: "Tokyo", country: "Japan", image: "🇯🇵", price: "$899" },
    { city: "New York", country: "USA", image: "🇺🇸", price: "$449" },
    { city: "Dubai", country: "UAE", image: "🇦🇪", price: "$699" },
  ];

  const handleStartBooking = () => {
    navigate('/flights');
  };

  const handleDestinationBook = (destination: any) => {
    updateSearchParams({
      origin: '',
      destination: destination.city,
      departureDate: '',
      passengers: 1,
      tripType: 'oneWay',
      class: 'any'
    });
    navigate('/flights');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4">
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
                onClick={() => navigate('/flights')}
                className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
              >
                Flights
              </button>
              <a href="#" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Support</a>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 font-medium">Welcome, {user?.username}</span>
                  <Button variant="outline" size="sm" onClick={logout} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Fly Anywhere,
              <span className="block text-blue-300">Anytime</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-gray-300"
            >
              Discover the world with our premium airline booking experience. 
              Book flights, choose seats, and travel with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleStartBooking}
                className="bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Booking <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <FlightSearch />
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Why Choose Airline POC?</h2>
            <p className="text-xl text-gray-400">Experience the future of airline booking</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 bg-gray-800 border border-gray-700 hover:border-blue-500"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Popular Destinations</h2>
            <p className="text-xl text-gray-400">Discover amazing places around the world</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-6xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                  <span className="relative z-10">{dest.image}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{dest.city}</h3>
                  <p className="text-gray-400 mb-4">{dest.country}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-400">{dest.price}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDestinationBook(dest)}
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">Airline POC</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your trusted partner for seamless travel experiences worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-blue-400">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/flights')}
                    className="hover:text-white transition-colors"
                  >
                    Book Flights
                  </button>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Manage Booking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Check-in</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Flight Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-blue-400">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-blue-400">Connect</h3>
              <div className="flex space-x-4">
                <Globe className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Star className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Airline POC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
