import express, { Express, Request, Response } from "express";
const port = 8080;

const app = express();

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})