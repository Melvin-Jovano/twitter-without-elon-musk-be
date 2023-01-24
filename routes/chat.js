import express from "express";
import { checkJWT } from "../middlewares/jwt.js";
import { getChatByGroupId } from "../controllers/chat.js";

const chatRouter = express.Router();

chatRouter.get('/chat/group/:groupId', checkJWT, getChatByGroupId);

export default chatRouter;