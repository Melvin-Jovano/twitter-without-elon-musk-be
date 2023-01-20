import express from "express";
import { checkJWT } from "../middlewares/jwt.js";
import { addChatList } from "../controllers/chat_list.js";

const chatListRouter = express.Router();

chatListRouter.post('/chat-list', checkJWT, addChatList);

export default chatListRouter;