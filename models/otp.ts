import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

otp.index( { "createdAt": 1 }, { expireAfterSeconds: 15 } );

export const otpSchema = mongoose.model('Otp', otp);