import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Users from '../models/Users';
import { UserAttributes, OTPStore, JWTPayload, mailOptions } from '../types';

const otpStore: OTPStore = {};

export const generateAccessToken = (user: UserAttributes): string => {
   try{
     return jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET!, {expiresIn: '15m'});
   } catch (err) {
        console.log(err);
        throw err
    }
}

export const generateRefreshToken = (user: UserAttributes): string => {
    try{
        return jwt.sign({id: user.id, username: user.username, type: 'refresh'}, process.env.JWT_REFRESH_SECRET!, {expiresIn: '1d'});
} catch (err) {
        console.log(err);
        throw err
    }}

export const verifyRefreshToken = async (refreshtoken: string): Promise<UserAttributes> => {
    try{
        const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET!) as JWTPayload;
        const user = await Users.findOne({where: {id: decoded.id}}) as UserAttributes | null;
        if (!user) {
            throw new Error('User not found');
        }
        return user

    } catch (err) {
        console.log(err);
        throw err
    }
}    

export const generateOTP = (email: string): number => {
   try{
     const createOTP = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 120000
    otpStore[email] = { createOTP, expiry };

    setTimeout(() => {
    delete otpStore[email];
    console.log(`OTP for ${email} expired and removed`);
    }, 120000);

    return createOTP;
   } catch (err) {
        console.log(err);
        throw err
    }
} 
export const sendOTP = async (email: string, otp: number): Promise<string> => {
    try{
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tlvanishq.234@gmail.com',
            pass: 'yqan bpev vemz hjco'
        }
    })

    const mailOptions: mailOptions = {
        from: 'tlvanishq.234@gmail.com',
        to: email,
        subject: 'OTP for verification',
        text: `Your OTP is ${otp}`
    }

    await transporter.sendMail(mailOptions)
    return `OTP sent to ${email}`;
    } catch (err) {
        console.log(err);
        throw err
    }
} 

export const verifyOTP = (otp: string, email: string): boolean  => {

    try{
        if (!otpStore[email]) throw new Error('OTP not found');

    const {createOTP, expiry} = otpStore[email];
    
    
    if (Date.now() > expiry) {
        delete otpStore[email];
        throw new Error('OTP expired')
    }
    if (parseInt(otp) !== createOTP) {
        delete otpStore[email];
        throw new Error('Invalid OTP')}

    delete otpStore[email];
    return true
    } catch (err) {
        console.log(err);
        throw err
    }
} 
