import express from "express";
import { checkJWT } from "../middlewares/jwt.js";
import { addChat, getChatByGroupId } from "../controllers/chat.js";

const chatRouter = express.Router();

chatRouter.post('/chat', checkJWT, addChat);
chatRouter.get('/chat/group/:groupId', checkJWT, getChatByGroupId);

export default chatRouter;