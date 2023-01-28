import express from "express";
import { createFollower, deleteFollowing, getAllFollower, getAllFollowing } from "../controllers/follow.js";
import { checkJWT } from "../middlewares/jwt.js";

const followRouter = express.Router();

followRouter.get('/followers', checkJWT, getAllFollower)
followRouter.get('/following', checkJWT, getAllFollowing)
followRouter.post('/follower', checkJWT, createFollower)
followRouter.delete('/delfollowing', checkJWT, deleteFollowing)

export default followRouter