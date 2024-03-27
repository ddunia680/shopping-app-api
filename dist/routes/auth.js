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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../models/auth");
const auth_2 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('/signup', (0, express_validator_1.body)('username').trim().isLength({ min: 3 }).withMessage('invalid username').custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
    const userDoc = yield auth_1.userModal.findOne({ username: value });
    if (userDoc) {
        return Promise.reject('username already in use, use a different one');
    }
})), (0, express_validator_1.body)('email').isEmail().withMessage('invalid email').normalizeEmail().custom((value_2, _b) => __awaiter(void 0, [value_2, _b], void 0, function* (value, { req }) {
    const userDoc = yield auth_1.userModal.findOne({ email: value });
    if (userDoc) {
        return Promise.reject('email already in use, use a different one');
    }
})), (0, express_validator_1.body)('password').isLength({ min: 5 }).withMessage('invalid password'), (0, express_validator_1.body)('confPass').isLength({ min: 5 }).withMessage('invalid password confirmation'), auth_2.signUp);
router.post('/verify/:email/:otp', auth_2.verifyOTP);
router.post('/requestOTp/:email', auth_2.requestOTp);
exports.default = router;
