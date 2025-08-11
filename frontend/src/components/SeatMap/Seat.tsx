// components/SeatMap/Seat.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Check } from 'lucide-react';

interface SeatProps {
  id: number;
  seatNumber: string;
  seatClass: 'economy' | 'business' | 'first';
  status: 'available' | 'reserved' | 'booked';
  price: number;
  lockedBy: number | null;
  isSelected: boolean;
  isMyReservation: boolean;
  onClick: () => void;
}

export const Seat: React.FC<SeatProps> = ({
  seatNumber,
  seatClass,
  status,
  price,
  isSelected,
  isMyReservation,
  onClick
}) => {
  const getSeatColor = () => {
    if (isSelected) return 'bg-blue-600 border-blue-400';
    if (status === 'booked') return 'bg-red-600 border-red-400';
    if (status === 'reserved') {
      return isMyReservation ? 'bg-orange-500 border-orange-400' : 'bg-gray-600 border-gray-400';
    }
    
    // Available seats by class
    switch (seatClass) {
      case 'first':
        return 'bg-purple-500 border-purple-300 hover:bg-purple-400';
      case 'business':
        return 'bg-green-500 border-green-300 hover:bg-green-400';
      case 'economy':
        return 'bg-blue-500 border-blue-300 hover:bg-blue-400';
      default:
        return 'bg-gray-500 border-gray-300 hover:bg-gray-400';
    }
  };

  const getSeatSize = () => {
    switch (seatClass) {
      case 'first':
        return 'w-12 h-12';
      case 'business':
        return 'w-10 h-10';
      case 'economy':
        return 'w-8 h-8';
      default:
        return 'w-8 h-8';
    }
  };

  const isClickable = status === 'available' || isMyReservation;

  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.1 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      className={`
        ${getSeatSize()}
        ${getSeatColor()}
        border-2 rounded-lg flex items-center justify-center
        text-white text-xs font-bold
        ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
        transition-all duration-200
        relative
      `}
      onClick={isClickable ? onClick : undefined}
      title={`${seatNumber} - ${seatClass.toUpperCase()} - $${price} - ${status.toUpperCase()}`}
    >
      {/* Seat Number */}
      <span className="text-[10px] font-bold">{seatNumber}</span>
      
      {/* Status Icons */}
      {status === 'booked' && (
        <div className="absolute -top-1 -right-1 bg-red-700 rounded-full p-0.5">
          <User className="w-2 h-2" />
        </div>
      )}
      
      {status === 'reserved' && !isMyReservation && (
        <div className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-0.5">
          <Lock className="w-2 h-2" />
        </div>
      )}
      
      {isSelected && (
        <div className="absolute -top-1 -right-1 bg-blue-800 rounded-full p-0.5">
          <Check className="w-2 h-2" />
        </div>
      )}
    </motion.div>
  );
};
