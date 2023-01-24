import express from "express";
import { createFollower, getAllFollower } from "../controllers/follower.js";
import { checkJWT } from "../middlewares/jwt.js";

const followerRouter = express.Router();

followerRouter.get('/followers', checkJWT, getAllFollower)
followerRouter.post('/follower', checkJWT, createFollower)

export default followerRouter