"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = exports.generateOTP = exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Users_1 = __importDefault(require("../models/Users"));
const otpStore = {};
const generateAccessToken = (user) => {
    try {
        return jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    try {
        return jsonwebtoken_1.default.sign({ id: user.id, username: user.username, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = async (refreshtoken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshtoken, process.env.JWT_REFRESH_SECRET);
        const user = await Users_1.default.findOne({ where: { id: decoded.id } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateOTP = (email) => {
    try {
        const createOTP = Math.floor(100000 + Math.random() * 900000);
        const expiry = Date.now() + 120000;
        otpStore[email] = { createOTP, expiry };
        setTimeout(() => {
            delete otpStore[email];
            console.log(`OTP for ${email} expired and removed`);
        }, 120000);
        return createOTP;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.generateOTP = generateOTP;
const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'tlvanishq.234@gmail.com',
                pass: 'yqan bpev vemz hjco'
            }
        });
        const mailOptions = {
            from: 'tlvanishq.234@gmail.com',
            to: email,
            subject: 'OTP for verification',
            text: `Your OTP is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        return `OTP sent to ${email}`;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = (otp, email) => {
    try {
        if (!otpStore[email])
            throw new Error('OTP not found');
        const { createOTP, expiry } = otpStore[email];
        if (Date.now() > expiry) {
            delete otpStore[email];
            throw new Error('OTP expired');
        }
        if (parseInt(otp) !== createOTP) {
            delete otpStore[email];
            throw new Error('Invalid OTP');
        }
        delete otpStore[email];
        return true;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.verifyOTP = verifyOTP;
