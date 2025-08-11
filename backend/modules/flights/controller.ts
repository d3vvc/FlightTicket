import { getAllFlightsDB, getFlightByIdDB, createFlightDB, handleFlightSearchDB } from "./service";
import { FlightCreationAttributes, FlightAttributes } from "../../types/index";
import { NextFunction, Request, Response } from "express";


interface CreateFightRequest extends Request {
    body: {
        flightData: FlightCreationAttributes;
        userId: number;
    };
}

interface SearchParams extends Request {
    body: {
        origin: string;
        destination: string;
        seat_class: string;
        date: string;
        sortBy?: string;
    };
}

export const getAllFlights = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const flights = await getAllFlightsDB();
        res.status(200).json({success: true, message: "All flights fetched successfully", flights});
    } catch (error) {
        next(error);
    }
}

export const getFlightbyId = async (req: Request, res: Response, next: NextFunction) => {
    const {flightId} = req.params;
    try {
        const flight = await getFlightByIdDB(flightId);
        res.status(200).json({success: true, message: "Flight fetched successfully", flight});
    } catch (error) {
        next(error);
    }
}
export const createFlight = async (req: CreateFightRequest, res: Response, next: NextFunction) => {
    const { flightData, userId } = req.body;
    try {
        const flight = await createFlightDB(userId, flightData);
        res.status(201).json({success: true, message: "Flight created successfully", flight});
    } catch (error) {
        next(error);
    }
}

export const handleFlightSearch = async (req: SearchParams, res: Response, next: NextFunction) => {
    console.log("Search Params:", req.body);
    const {origin, destination, seat_class, date, sortBy} = req.body;
    try {
        const flights = await handleFlightSearchDB(origin, destination, seat_class, date, sortBy);
        res.status(200).json({success: true, message: "Flight search results", flights});
} catch (error) {
    next(error);
    }}