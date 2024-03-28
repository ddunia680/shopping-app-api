"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const otp = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    otpCode: {
        type: String,
        required: true
    }
}, { timestamps: true });
otp.index({ "createdAt": 1 }, { expireAfterSeconds: 30 });
exports.otpSchema = mongoose_1.default.model('Otp', otp);
