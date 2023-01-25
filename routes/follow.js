import express from "express";
import { createFollower, getAllFollower, getAllFollowing } from "../controllers/follow.js";
import { checkJWT } from "../middlewares/jwt.js";

const followRouter = express.Router();

followRouter.get('/followers', checkJWT, getAllFollower)
followRouter.get('/following', checkJWT, getAllFollowing)
followRouter.post('/follower', checkJWT, createFollower)

export default followRouter