import express from "express";
import { checkJWT } from "../middlewares/jwt.js";
import { addChat } from "../controllers/chat.js";

const chatRouter = express.Router();

chatRouter.post('/chat', checkJWT, addChat);

export default chatRouter;