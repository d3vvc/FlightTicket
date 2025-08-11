import LoginAttempts from "../models/LoginAttempts";

export interface UserAttributes {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    password: string;
    createdAt?: Date;
    updatedAt?: Date;

}

export interface UserwithLoginAttempts extends UserAttributes {
  loginAttempts?: LoginAttempts | null;
}

export interface UserCreationAttributes {
    username: string, 
    email: string, 
    password: string, 
    role: "admin" | "user",
}

export interface LoginAttemptsAttributes {
    id: number;
    userId: number;
  incorrectAttempts: number;
  lockedUntil: Date | null;
  lastAttemptAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginAttemptsCreationAttributes {
    userId: number;
    incorrectAttempts?: number;
    lockedUntil?: Date | null;
    lastAttemptAt?: Date;
  }

  export interface FlightAttributes {
    id: number;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    aircraftType?: string;
    totalSeats: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface FlightCreationAttributes {
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    aircraftType?: string;
    totalSeats: number;
  } 
  
  export type SeatStatus = 'available' | 'reserved' | 'booked';
  export type SeatClass = 'economy' | 'business' | 'first';
  
  export interface SeatAttributes {
    id: number;
    flightId: number;
    seatNumber: string;
    seat_class: SeatClass;
    status: SeatStatus;
    price: number;
    locked_by: number | null;
    lock_expiry: Date | null;
    createdAt?: Date;
    updatedAt?: Date;

  user?: UserAttributes;
  flight?: FlightAttributes;
  }
  
  export interface SeatCreationAttributes {
    flightId: number;
    seatNumber: string;
    seat_class?: SeatClass;
    status?: SeatStatus;
    price: number;
    locked_by?: number | null;
    lock_expiry?: Date | null;
  }
  
  export interface AuthResponse {
    success: boolean;
    user: {
      id: number;
      username: string;
      email: string;
      role: 'user' | 'admin';
    };
    token: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
  }

 export interface OTPData {
    createOTP: number;
    expiry: number;
}

export interface OTPStore {
    [email: string]: OTPData;
}

export interface JWTPayload {
    id: string;
    username: string;
    type?: string;
}

export interface mailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}
