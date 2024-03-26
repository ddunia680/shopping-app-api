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
exports.signUp = void 0;
const express_validator_1 = require("express-validator");
const auth_1 = require("../models/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        });
    }
    console.log(req.body);
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
        const hashesPass = yield bcrypt_1.default.hash(password, 12);
        const user = new auth_1.userModal({
            username: username,
            email: email,
            password: hashesPass
        });
        const response = yield user.save();
        res.status(200).json({
            user: { _id: response._id, username: response.username, email: response.email },
            message: `successfully created user ${response.username}`
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        });
    }
    ;
});
exports.signUp = signUp;
