import express from 'express';
import { body } from 'express-validator';
import { userModal } from '../models/auth';

import { requestOTp, signUp, verifyOTP } from '../controllers/auth';

const router = express.Router();


router.post(
    '/signup', 
    body('username').trim().isLength({ min: 3 }).withMessage('invalid username').custom(async (value, { req }) => {
        const userDoc = await userModal.findOne({ username: value });
        if (userDoc) {
            return Promise.reject('username already in use, use a different one');
        }
    }),
    body('email').isEmail().withMessage('invalid email').normalizeEmail().custom(async (value, { req }) => {
        const userDoc = await userModal.findOne({email: value});
        if(userDoc) {
            return Promise.reject('email already in use, use a different one');
        }
    }),
    body('password').isLength({ min: 5 }).withMessage('invalid password'),
    body('confPass').isLength({ min: 5 }).withMessage('invalid password confirmation'),
    signUp
);

router.post('/verify/:email/:otp', verifyOTP );

router.post('/requestOTp/:email', requestOTp);

export default router;