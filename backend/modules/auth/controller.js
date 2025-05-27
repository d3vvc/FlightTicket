import {verifyRefreshToken, generateAccessToken, generateRefreshToken, generateOTP, sendOTP, verifyOTP} from '../../utils/login_helper.js';
import { registerDB, loginDB } from './service.js';

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
        const user = await loginDB(username, password);

        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000});
        res.status(200).json({token, user});
    }
    catch (err) {
        res.status(err.status || 500).json({error: err.message});
        console.log(err);
    }
}