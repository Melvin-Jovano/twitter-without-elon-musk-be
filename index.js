import express from 'express';
import authRouter from './routes/auth.js';
import cors from 'cors';
import config from './config/app.js';
import userRouter from './routes/user.js';
import postsRouter from './routes/posts.js';
import chatListRouter from './routes/chat_list.js';
import chatRouter from './routes/chat.js';
import Socket from './loaders/socket.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(authRouter);
app.use(userRouter);
app.use(postsRouter);
app.use(chatListRouter);
app.use(chatRouter);

app.listen(config.APP_PORT, () => {
    console.log(`Server Activated On Port ${config.APP_PORT}`);
});

export const chatSocket = new Socket(app, 3001);