import express, { Express, Request, Response, response, } from "express";
import mongoose, { Callback } from "mongoose";
import cors from "cors";
import multer, { FileFilterCallback } from 'multer';
import bodyParser from "body-parser";
import userRoutes from './routes/user';
import authRoutes from './routes/auth';


import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;

const app = express();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if(
        file.mimetype === 'image/png',
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: 'Content-Type Authorization',
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}))

app.use(express.json());
app.use(bodyParser.json());
app.use(multer({fileFilter: fileFilter}).array('photos', 12));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

mongoose.connect(process.env.MONGO_DB_URI as string)
.then(response => {
    const server = app.listen(port, () => {
        console.log(`now listening on port ${port}`);
        
    })
});