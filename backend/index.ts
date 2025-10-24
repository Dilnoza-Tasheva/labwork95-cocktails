import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import config from "./config";
import usersRouter from "./routers/users";
import cocktailsRouter from "./routers/cocktails";
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/users', usersRouter);
app.use('/cocktails', cocktailsRouter);

const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => console.log(`Listening on port ${port}`));

    process.on('exit', () => { mongoose.disconnect(); });
};
run().catch(console.error);
