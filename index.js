import express from 'express';
import authRouter from './routes/auth.js';
import cors from 'cors';
import config from './config/app.js';
import userRouter from './routes/user.js';
import postsRouter from './routes/posts.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(authRouter);
app.use(userRouter);
app.use(postsRouter);

app.listen(config.APP_PORT, () => {
    console.log(`Server Activated On Port ${config.APP_PORT}`);
})