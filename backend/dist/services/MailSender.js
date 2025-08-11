"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const Users_1 = __importDefault(require("../models/Users"));
const sequelize_1 = require("sequelize");
const Seat_1 = __importDefault(require("../models/Seat"));
const Flights_1 = __importDefault(require("../models/Flights"));
const cron = __importStar(require("node-cron"));
const seatsNeedingNotification = async () => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seats = await Seat_1.default.findAll({
        where: {
            locked_by: { [sequelize_1.Op.not]: null },
            status: { [sequelize_1.Op.in]: ['reserved'] }
        },
        include: [{
                model: Flights_1.default,
                as: 'flight',
                where: {
                    departureTime: {
                        [sequelize_1.Op.between]: [today, sevenDaysFromNow]
                    }
                }
            }, {
                model: Users_1.default,
                foreignKey: 'locked_by',
                as: 'user',
                attributes: ['email', 'username', 'id']
            }]
    });
    return seats;
};
const sendNotificationEmail = async (seats) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'tlvanishq.234@gmail.com',
                pass: 'yqan bpev vemz hjco'
            }
        });
        for (const seat of seats) {
            const user = seat.user;
            const flight = seat.flight;
            if (!user || !flight) {
                console.log(`Skipping seat ${seat.seatNumber} due to missing user or flight information.`);
                continue;
            }
            const daysUntilFlight = Math.ceil((flight.departureTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const mailOptions = {
                from: process.env.EMAIL_USER || 'tlvanishq.234@gmail.com',
                to: user.email,
                subject: `Flight Reminder: ${daysUntilFlight} days until departure`,
                text: `Dear ${user.username}, your flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination} is departing in ${daysUntilFlight} days on ${flight.departureTime.toDateString()}. Your seat is ${seat.seatNumber} (${seat.seat_class}). Please arrive at the airport 2-3 hours early. Have a great trip!`
            };
            await transporter.sendMail(mailOptions);
        }
        return `Successfully sent flight reminder emails`;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
const PollingService = async () => {
    const seats = await seatsNeedingNotification();
    if (seats.length > 0) {
        const result = await sendNotificationEmail(seats);
        console.log(result);
    }
};
cron.schedule('0 9 * * *', PollingService, {
    timezone: "Asia/Kolkata"
});
exports.default = PollingService;
