// pages/LoginPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { LoginForm } from '../components/Auth/LoginForm';
import { RegisterForm } from '../components/Auth/RegisterForm';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-500/10 to-transparent"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full mr-4 shadow-lg"
              >
                <Plane className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white">Airline POC</h1>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Journey
              <span className="text-blue-400 block">Starts Here</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Book flights, select seats, and manage your travel experience with our 
              modern airline booking platform.
            </p>

            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">500+</div>
                <div className="text-gray-400">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">1M+</div>
                <div className="text-gray-400">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Form Toggle */}
            <div className="bg-gray-800 rounded-2xl p-2 mb-6 border border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    isLogin
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    !isLogin
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Forms */}
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
