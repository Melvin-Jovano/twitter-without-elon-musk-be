import express from "express";
import { getHashtags } from "../controllers/hashtag.js";

const hashtagRouter = express.Router();

hashtagRouter.get('/hashtags', getHashtags);
 
export default hashtagRouter;