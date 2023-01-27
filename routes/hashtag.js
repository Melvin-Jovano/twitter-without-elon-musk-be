import express from "express";
import { getHashtags } from "../controllers/hashtag.js";
import { checkJWT } from "../middlewares/jwt.js";

const hashtagRouter = express.Router();

hashtagRouter.get('/hashtags', checkJWT, getHashtags);
 
export default hashtagRouter;