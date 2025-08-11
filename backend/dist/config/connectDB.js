"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const db_1 = require("./db");
const connectDB = async () => {
    try {
        await db_1.sequelizer.authenticate();
        await db_1.sequelizer.sync();
        console.log('PostgreSQL connected');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
exports.connectDB = connectDB;
