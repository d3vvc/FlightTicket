"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetFailedAttempts = exports.recordFailedAttempts = exports.checkLoginStatus = void 0;
const LoginAttempts_1 = __importDefault(require("../models/LoginAttempts"));
const Users_1 = __importDefault(require("../models/Users"));
const checkLoginStatus = async (username) => {
    try {
        const user = await Users_1.default.findOne({
            where: { username },
            include: [{
                    model: LoginAttempts_1.default,
                    as: 'loginAttempts'
                }]
        });
        if (!user) {
            throw new Error('User not found');
        }
        const loginAttempts = user.loginAttempts;
        if (!loginAttempts) {
            return { user, isLocked: false };
        }
        if (loginAttempts.lockedUntil && new Date() < loginAttempts.lockedUntil) {
            const remainingTime = Math.ceil((Number(loginAttempts.lockedUntil) - Number(new Date())) / 1000);
            throw new Error(`Account locked. Try again in ${remainingTime} seconds`);
        }
        if (loginAttempts.lockedUntil && new Date() >= loginAttempts.lockedUntil) {
            await loginAttempts.update({
                lockedUntil: null,
                incorrectAttempts: 0
            });
        }
        return { user, isLocked: false };
    }
    catch (error) {
        console.error("Error checking login status:", error);
        throw new Error('Could not check login status');
    }
};
exports.checkLoginStatus = checkLoginStatus;
const recordFailedAttempts = async (userId) => {
    try {
        let loginAttempt = await LoginAttempts_1.default.findOne({
            where: { userId }
        });
        if (!loginAttempt) {
            loginAttempt = await LoginAttempts_1.default.create({
                userId,
                incorrectAttempts: 1,
                lockedUntil: null,
                lastAttemptAt: new Date()
            });
        }
        else {
            const newAttempts = loginAttempt.incorrectAttempts + 1;
            let lockedUntil = new Date();
            if (newAttempts % 3 === 0) {
                lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
            }
            await loginAttempt.update({
                incorrectAttempts: newAttempts,
                lockedUntil,
                lastAttemptAt: new Date()
            });
        }
        return loginAttempt;
    }
    catch (error) {
        console.error("Error recording failed attempts:", error);
        throw new Error('Could not record failed attempts');
    }
};
exports.recordFailedAttempts = recordFailedAttempts;
const resetFailedAttempts = async (userId) => {
    try {
        await LoginAttempts_1.default.update({
            incorrectAttempts: 0,
            lockedUntil: null,
            lastAttemptAt: new Date()
        }, {
            where: { userId },
        });
    }
    catch (error) {
        console.error("Error resetting failed attempts:", error);
        throw new Error('Could not reset failed attempts');
    }
};
exports.resetFailedAttempts = resetFailedAttempts;
