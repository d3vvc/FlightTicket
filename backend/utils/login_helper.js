import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const otpStore = {};



export const generateAccessToken = (user) => {
   try{
     return jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '15m'});
   } catch (err) {
        console.log(err);
        throw err
    }
}

export const generateRefreshToken = (user) => {
    try{
        return jwt.sign({id: user.id, username: user.username, type: 'refresh'}, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'});
} catch (err) {
        console.log(err);
        throw err
    }}

export const verifyRefreshToken = async (refreshtoken) => {
    try{
        const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({error: 'unauthorized'});
        return user

    } catch (err) {
        console.log(err);
        throw err
    }
}    

export const generateOTP = (email) => {
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
export const sendOTP = async (email, otp) => {
    try{
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tlvanishq.234@gmail.com',
            pass: 'yqan bpev vemz hjco'
        }
    })

    const mailOptions = {
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

export const verifyOTP = async (otp, email) => {

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
