"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomErrors_1 = require("../utils/CustomErrors");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof CustomErrors_1.AuthenticationError) {
        res.status(err.statusCode || 401).json({ success: false, message: err.message });
    }
    if (err instanceof CustomErrors_1.AuthorizationError) {
        res.status(err.statusCode || 403).json({ success: false, message: err.message });
    }
    if (err instanceof CustomErrors_1.NotFoundError) {
        res.status(err.statusCode || 404).json({ success: false, message: err.message });
    }
    if (err instanceof CustomErrors_1.DatabaseError) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        error: err.message || 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
