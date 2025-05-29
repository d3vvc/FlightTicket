import { AuthenticationError, AuthorizationError, NotFoundError, DatabaseError  } from "../utils/CustomErrors";

export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof AuthenticationError) {
        return res.status(err.statusCode || 401).json({ success: false, message: err.message });
    }
    if (err instanceof AuthorizationError) {
        return res.status(err.statusCode || 403).json({ success: false, message: err.message });
    }
    if (err instanceof NotFoundError) {
        return res.status(err.statusCode || 404).json({ success: false, message: err.message });
    }
    if (err instanceof DatabaseError) {
        return res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }

    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        error: err.message || 'Internal Server Error'
    });
}