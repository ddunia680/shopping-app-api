"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('/signup', (0, express_validator_1.body)('username').trim().isLength({ min: 3 }).withMessage('invalid username'), (0, express_validator_1.body)('email').isEmail().withMessage('invalid email').normalizeEmail(), (0, express_validator_1.body)('password').isLength({ min: 5 }).withMessage('invalid password'), (0, express_validator_1.body)('confPass').isLength({ min: 5 }).withMessage('invalid password confirmation'), auth_1.signUp);
router.post('/verify/:id/:otp', auth_1.verifyOTP);
exports.default = router;
