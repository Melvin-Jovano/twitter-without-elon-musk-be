import express from "express";
import { likePost } from "../controllers/like.js";
import { checkJWT } from "../middlewares/jwt.js";

const likeRouter = express.Router();

likeRouter.put('/like/post/:postId', checkJWT, likePost);
 
export default likeRouter;