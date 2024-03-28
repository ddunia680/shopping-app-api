"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const user = new Schema({
    username: String,
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    password: String,
    verified: {
        type: Boolean,
        default: false
    }
});
exports.userModal = mongoose_1.default.model('User', user);
