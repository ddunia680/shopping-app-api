import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { userModal }  from '../models/auth';
import bcrypt from 'bcrypt';

export const signUp = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        })
    }
    console.log(req.body);
    
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
        const hashesPass = await bcrypt.hash(password, 12);
        const user = new userModal({
            username: username,
            email: email,
            password: hashesPass
        });

        const response = await user.save();
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