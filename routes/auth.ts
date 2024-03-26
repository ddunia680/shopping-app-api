import express from 'express';
import { body } from 'express-validator';

import { signUp, verifyOTP } from '../controllers/auth';

const router = express.Router();


router.post(
    '/signup', 
    body('username').trim().isLength({ min: 3 }).withMessage('invalid username'),
    body('email').isEmail().withMessage('invalid email').normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('invalid password'),
    body('confPass').isLength({ min: 5 }).withMessage('invalid password confirmation'),
    signUp
);

router.post( '/verify/:id/:otp', verifyOTP );

export default router;