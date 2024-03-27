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
        const theCode = [Math.floor(Math.random()* 10), Math.floor(Math.random()*10), Math.floor(Math.random() * 10), 
            Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)].join('');

            // Email not going, start here...
        const msg = {
            to: email,
            from: 'duniadunia372@gmail.com',
            subject: 'OTP verification Code',
            html: `<p>Hello there<br/> Your verification code for your account is <strong>${theCode}</strong></p>`,
            text: 'Have fun!'
        }
        const feedback = await sqMail.send(msg);
        console.log(feedback);
        const hashesPass = await bcrypt.hash(password, 12);
        const user = new userModal({
            username: username,
            email: email,
            password: hashesPass
        });

        const response = await user.save();
        const theOtp = new otpSchema({
            userId: response._id,
            otpCode: theCode
        })
        const output = await theOtp.save();
        res.status(200).json({
            user: {_id:response._id, username: response.username, email: response.email},
            message: `successfully created user ${response.username}`
        })
    } catch(err) {
        console.log(err);
        
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    };
};

export const verifyOTP = async (req: Request, res: Response) => {    
    const email = req.params.email;
    const otp = req.params.otp;

    try {
        const theUser = await userModal.findOne({ email: email });
        if(theUser) {
            const theOTPData = await otpSchema.findOne({ userId: theUser._id });
                if(!theOTPData) {
                    return res.status(500).json({
                        message: 'otp already expired, request for a new one'
                    })
                }
            
            if(theOTPData.otpCode.toString() !== otp.toString()) {
                return res.status(500).json({
                    message: 'wrong OTP entered!'
                })
            }
            theUser.verified = true;
            const output = await theUser.save();
                    
            res.status(200).json({
                message: 'correct otp'
            })
        }
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}

export const requestOTp = async (req: Request, res: Response) => {
    const email = req.params.email;

    try {
        const theUser = await userModal.findOne({ email: email });
        if(theUser) {
            const theCode = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 
                Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)].join('');

            const msg = {
                to: theUser.email,
                from: 'duniadunia372@gmail.com',
                subject: 'OTP verification Code',
                html: `<p>Hello there<br/> Your verification code for your account is <strong>${theCode}</strong></p>`,
                text: 'Have fun!'
            }
            const feedback = await sqMail.send(msg);
            console.log(feedback);

            const theOtp = new otpSchema({
                userId: theUser._id,
                otpCode: theCode
            })
            const output = await theOtp.save();
            res.status(200).json({
                message: 'successfully sent new otp'
            })
        } else {
            return res.status(500).json({
                message: 'email not found'
            })
        }
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}