import mongoose, { SchemaType } from "mongoose";

interface schemaTypes {
    username: string,
    email: string,
    password: string,
    verified: Boolean
}

const Schema = mongoose.Schema;

const user = new Schema<schemaTypes>({
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

export const userModal = mongoose.model('User', user);