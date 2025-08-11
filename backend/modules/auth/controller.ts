import { NextFunction, Request, Response } from 'express';
import {verifyRefreshToken, generateAccessToken, generateRefreshToken, generateOTP, sendOTP, verifyOTP} from '../../utils/login_helper';
import { registerDB, loginDB, sendOTP_DB, resetPWD_DB } from './service';
import { UserAttributes } from '../../types/index';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {username, password, email, role} = req.body;
    try {
        const newUser: UserAttributes = await registerDB({username, password, email, role});
    
        const token = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000});
        res.status(201).json({success: true,  message:"registered" ,token, data: newUser});
    }
    catch (err) {
        next(err);
    }
}
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {username, password} = req.body;
    try {
       
        const user = await loginDB(username, password);

        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000});
        res.status(200).json({success: true, message:"logged in", token, data: user});
    }
    catch (err) {
        next(err);
    }
}

export const logout = (res: Response): void => {
    const token = ""
    res.clearCookie('refreshToken', {httpOnly: true, secure: false, sameSite: 'strict'});
    res.status(200).json({message: 'Logged out successfully' , token});
}

export const refreshToken = async (req: Request,res: Response, next: NextFunction): Promise<void> => {
    const refreshtoken = req.cookies.refreshToken;
    if (!refreshtoken) 
        res.status(401).json({error: 'unauthorized'});

    try{
        const user = await verifyRefreshToken(refreshtoken);
        const newToken = generateAccessToken(user);

        res.status(200).json({token: newToken});

    } catch (err) {
        next(err);
    }
}


 export const send_OTP = async (req: Request,res: Response): Promise<void> => {
    const {email} = req.body;
    const user = sendOTP_DB(email);
    console.log(user);
    if (!user) res.status(400).json({error: 'invalid credentials'});

    const otp = generateOTP(email);

    const confirm = await sendOTP(email, otp)
    console.log(confirm);
    res.status(200).json({message: 'OTP sent successfully'});
   

}

 export const verify_OTP =  (req: Request,res: Response, next: NextFunction): void  => {
    try{
    const {otp,email} = req.body;
    
    verifyOTP(otp,email);
    res.status(200).json({message: 'OTP verified successfully'});}
    catch (err) {
        next(err);
    }
       
    }
    

 export const reset_password = async (req: Request,res: Response): Promise<void> => {
    const {email, password} = req.body;
    const result = await resetPWD_DB(email, password);
    if (!result) res.status(400).json({error: 'invalid credentials'});

    
    res.status(200).json({message: 'Password reset successfully'});
}

