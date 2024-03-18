import express, { Express, Request, Response } from "express";
const port = 8080;

const app = express();

app.get('/', (req, res) => {
    res.send("Hello from Express + TS");
})

app.get('/hi', (req, res) => {
    res.send("Hello hello!");
});

app.get('/well', (req, res) => {
    res.send("well well!");
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})