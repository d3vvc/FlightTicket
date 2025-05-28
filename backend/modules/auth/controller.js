import {verifyRefreshToken, generateAccessToken, generateRefreshToken, generateOTP, sendOTP, verifyOTP} from '../../utils/login_helper.js';
import { registerDB, loginDB } from './service.js';
import { resetFailedAttempts, recordFailedAttempts, checkLoginStatus } from '../../services/LoginSecurity.js';

export const register = async (req, res) => {
    const {username, password, email, role} = req.body;
    try {
        const newUser = await registerDB(username, password, email, role);
        
        const token = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000});
        res.status(201).json({token, newUser});
    }
    catch (err) {
        res.status(err.status || 500).json({error: err.message});
        console.log(err);
    }
}
export const login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const loginAttempts = await checkLoginStatus(username);
        if (loginAttempts.isLocked) {
            return res.status(403).json({error: 'Account is locked due to multiple failed login attempts. Please try again later.'});
        }
        const user = await loginDB(username, password);
        if (!user) {
            await recordFailedAttempts(username);
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await resetFailedAttempts(username); 
        
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000});
        res.status(200).json({token, user});
    }
    catch (err) {
        res.status(err.status || 500).json({error: err.message});
        console.log(err);
    }
}

export const logout = (req, res) => {
    const token = ""
    res.clearCookie('refreshToken', {httpOnly: true, secure: false, sameSite: 'strict'});
    res.status(200).json({message: 'Logged out successfully' , token});
}