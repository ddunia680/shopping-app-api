import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { userModal }  from '../models/auth';
import { otpSchema } from "../models/otp";
import bcrypt from 'bcrypt';
import sqMail from '@sendgrid/mail';
import dotenv from 'dotenv'
dotenv.config();
sqMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const signUp = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        })
    }
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confPass = req.body.confPass;

    if(password !== confPass) {
        return res.status(422).json({
            message: "confirm password doesn't match password"
        })
    }

    try {
        const theCode = [Math.floor(Math.random()), Math.floor(Math.random()), Math.floor(Math.random()), Math.floor(Math.random()),
            Math.floor(Math.random()), Math.floor(Math.random())].join('');
        const msg = {
            to: email,
            from: 'ddunia680@gmail.com',
            subject: 'OTP verification Code',
            html: `<p>Hello there<br/> Your verification code for your account is <strong>${theCode}</strong></p>`,
            text: 'Have fun!'
        }
        const feedback = await sqMail.send(msg);
        console.log(feedback);
        const hashedOTPCode = await bcrypt.hash(theCode, 12);
        const hashesPass = await bcrypt.hash(password, 12);
        const user = new userModal({
            username: username,
            email: email,
            password: hashesPass
        });

        const response = await user.save();
        const theOtp = new otpSchema({
            userId: response._id,
            otpCode: hashedOTPCode
        })
        const output = await theOtp.save();
        res.status(200).json({
            user: {_id:response._id, username: response.username, email: response.email},
            message: `successfully created user ${response.username}`
        })
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    };
};

export const verifyOTP = async (req: Request, res: Response) => {    
    const id = req.params.id;
    const otp = req.params.otp;

    try {
        const theOTPData = await otpSchema.findOne({ userId: id });
            if(!theOTPData) {
                return res.status(500).json({
                    message: 'otp already expired, request for a new one'
                })
            }
        
        const theOutput = await bcrypt.compare( theOTPData.otpCode, otp);
        if(!theOutput) {
            return res.status(500).json({
                message: 'wrong OTP entered!'
            })
        }
        
        res.status(200).json({
            message: 'correct otp'
        })
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
    
    


}