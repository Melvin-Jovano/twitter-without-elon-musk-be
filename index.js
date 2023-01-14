import express from 'express';
import authRouter from './routes/auth.js';
import cors from 'cors';
import config from './config/app.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(authRouter);

app.listen(config.APP_PORT, () => {
    console.log(`Server Activated On Port ${config.APP_PORT}`);
})