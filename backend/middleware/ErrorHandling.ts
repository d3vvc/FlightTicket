import { NextFunction, Request, Response } from "express";
import { AuthenticationError, AuthorizationError, NotFoundError, DatabaseError  } from "../utils/CustomErrors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof AuthenticationError) {
        res.status(err.statusCode || 401).json({ success: false, message: err.message });
    }
    if (err instanceof AuthorizationError) {
        res.status(err.statusCode || 403).json({ success: false, message: err.message });
    }
    if (err instanceof NotFoundError) {
        res.status(err.statusCode || 404).json({ success: false, message: err.message });
    }
    if (err instanceof DatabaseError) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }

    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        error: err.message || 'Internal Server Error'
    });
}