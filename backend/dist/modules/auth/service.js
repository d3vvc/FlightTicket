"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPWD_DB = exports.sendOTP_DB = exports.loginDB = exports.registerDB = void 0;
const Users_1 = __importDefault(require("../../models/Users"));
const CustomErrors_1 = require("../../utils/CustomErrors");
const LoginSecurity_1 = require("../../services/LoginSecurity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerDB = async (params) => {
    if (!params.username || !params.password || !params.email || !params.role) {
        throw new CustomErrors_1.AuthenticationError('All fields are required');
    }
    const hashedPassword = await bcrypt_1.default.hash(params.password, 10);
    const newUser = await Users_1.default.create({ ...params, password: hashedPassword });
    if (!newUser) {
        throw new CustomErrors_1.AuthenticationError('User registration failed');
    }
    return newUser;
};
exports.registerDB = registerDB;
const loginDB = async (username, password) => {
    if (!username || !password) {
        throw new CustomErrors_1.AuthenticationError('Username and password are required');
    }
    const loginAttempts = await (0, LoginSecurity_1.checkLoginStatus)(username);
    if (loginAttempts.isLocked) {
        throw new CustomErrors_1.AuthorizationError('Account is locked due to multiple failed login attempts. Please try again later.');
    }
    const user = await Users_1.default.findOne({ where: { username: username } });
    if (!user) {
        throw new CustomErrors_1.NotFoundError('User not found');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        await (0, LoginSecurity_1.recordFailedAttempts)(user.id);
        throw new CustomErrors_1.AuthenticationError('Invalid password');
    }
    await (0, LoginSecurity_1.resetFailedAttempts)(user.id);
    return user;
};
exports.loginDB = loginDB;
const sendOTP_DB = async (email) => {
    const user = await Users_1.default.findOne({ where: { email } });
    return user;
};
exports.sendOTP_DB = sendOTP_DB;
const resetPWD_DB = async (email, password) => {
    const user = await Users_1.default.findOne({ where: { email } });
    if (!user) {
        throw new CustomErrors_1.NotFoundError('User not found');
    }
    user.password = password;
    await user.save();
    return true;
};
exports.resetPWD_DB = resetPWD_DB;
