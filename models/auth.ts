import mongoose, { SchemaType } from "mongoose";

interface schemaTypes {
    username: string,
    email: string,
    password: string,
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
});

export const userModal = mongoose.model('User', user);