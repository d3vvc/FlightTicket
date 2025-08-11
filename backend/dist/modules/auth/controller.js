"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset_password = exports.verify_OTP = exports.send_OTP = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const login_helper_1 = require("../../utils/login_helper");
const service_1 = require("./service");
const register = async (req, res, next) => {
    const { username, password, email, role } = req.body;
    try {
        const newUser = await (0, service_1.registerDB)({ username, password, email, role });
        const token = (0, login_helper_1.generateAccessToken)(newUser);
        const refreshToken = (0, login_helper_1.generateRefreshToken)(newUser);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ success: true, message: "registered", token, data: newUser });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await (0, service_1.loginDB)(username, password);
        const token = (0, login_helper_1.generateAccessToken)(user);
        const refreshToken = (0, login_helper_1.generateRefreshToken)(user);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ success: true, message: "logged in", token, data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const logout = (res) => {
    const token = "";
    res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'strict' });
    res.status(200).json({ message: 'Logged out successfully', token });
};
exports.logout = logout;
const refreshToken = async (req, res, next) => {
    const refreshtoken = req.cookies.refreshToken;
    if (!refreshtoken)
        res.status(401).json({ error: 'unauthorized' });
    try {
        const user = await (0, login_helper_1.verifyRefreshToken)(refreshtoken);
        const newToken = (0, login_helper_1.generateAccessToken)(user);
        res.status(200).json({ token: newToken });
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
const send_OTP = async (req, res) => {
    const { email } = req.body;
    const user = (0, service_1.sendOTP_DB)(email);
    console.log(user);
    if (!user)
        res.status(400).json({ error: 'invalid credentials' });
    const otp = (0, login_helper_1.generateOTP)(email);
    const confirm = await (0, login_helper_1.sendOTP)(email, otp);
    console.log(confirm);
    res.status(200).json({ message: 'OTP sent successfully' });
};
exports.send_OTP = send_OTP;
const verify_OTP = (req, res, next) => {
    try {
        const { otp, email } = req.body;
        (0, login_helper_1.verifyOTP)(otp, email);
        res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.verify_OTP = verify_OTP;
const reset_password = async (req, res) => {
    const { email, password } = req.body;
    const result = await (0, service_1.resetPWD_DB)(email, password);
    if (!result)
        res.status(400).json({ error: 'invalid credentials' });
    res.status(200).json({ message: 'Password reset successfully' });
};
exports.reset_password = reset_password;
