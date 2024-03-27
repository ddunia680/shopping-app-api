"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOTp = exports.verifyOTP = exports.signUp = void 0;
const express_validator_1 = require("express-validator");
const auth_1 = require("../models/auth");
const otp_1 = require("../models/otp");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        });
    }
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confPass = req.body.confPass;
    if (password !== confPass) {
        return res.status(422).json({
            message: "confirm password doesn't match password"
        });
    }
    try {
        const theCode = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)].join('');
        // Email not going, start here...
        const msg = {
            to: email,
            from: 'duniadunia372@gmail.com',
            subject: 'OTP verification Code',
            html: `<p>Hello there<br/> Your verification code for your account is <strong>${theCode}</strong></p>`,
            text: 'Have fun!'
        };
        const feedback = yield mail_1.default.send(msg);
        console.log(feedback);
        const hashesPass = yield bcrypt_1.default.hash(password, 12);
        const user = new auth_1.userModal({
            username: username,
            email: email,
            password: hashesPass
        });
        const response = yield user.save();
        const theOtp = new otp_1.otpSchema({
            userId: response._id,
            otpCode: theCode
        });
        const output = yield theOtp.save();
        res.status(200).json({
            user: { _id: response._id, username: response.username, email: response.email },
            message: `successfully created user ${response.username}`
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'something went wrong server-side'
        });
    }
    ;
});
exports.signUp = signUp;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const otp = req.params.otp;
    try {
        const theUser = yield auth_1.userModal.findOne({ email: email });
        if (theUser) {
            const theOTPData = yield otp_1.otpSchema.findOne({ userId: theUser._id });
            if (!theOTPData) {
                return res.status(500).json({
                    message: 'otp already expired, request for a new one'
                });
            }
            if (theOTPData.otpCode.toString() !== otp.toString()) {
                return res.status(500).json({
                    message: 'wrong OTP entered!'
                });
            }
            theUser.verified = true;
            const output = yield theUser.save();
            res.status(200).json({
                message: 'correct otp'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        });
    }
});
exports.verifyOTP = verifyOTP;
const requestOTp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        const theUser = yield auth_1.userModal.findOne({ email: email });
        if (theUser) {
            const theCode = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)].join('');
            const msg = {
                to: theUser.email,
                from: 'duniadunia372@gmail.com',
                subject: 'OTP verification Code',
                html: `<p>Hello there<br/> Your verification code for your account is <strong>${theCode}</strong></p>`,
                text: 'Have fun!'
            };
            const feedback = yield mail_1.default.send(msg);
            console.log(feedback);
            const theOtp = new otp_1.otpSchema({
                userId: theUser._id,
                otpCode: theCode
            });
            const output = yield theOtp.save();
            res.status(200).json({
                message: 'successfully sent new otp'
            });
        }
        else {
            return res.status(500).json({
                message: 'email not found'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        });
    }
});
exports.requestOTp = requestOTp;
