import express from "express";
import { checkJWT } from "../middlewares/jwt.js";
import { addChatList, getChatLists } from "../controllers/chat_list.js";

const chatListRouter = express.Router();

chatListRouter.post('/chat-list', checkJWT, addChatList);
chatListRouter.get('/chat-list', checkJWT, getChatLists);

export default chatListRouter;