import express from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.js";
import { checkJWT } from "../middlewares/jwt.js";

const authRouter = express.Router();

authRouter.post('/auth/login', login);
authRouter.post('/auth/register', register);
authRouter.post('/auth/logout', checkJWT, logout);
authRouter.post('/auth/refresh', refreshToken);

export default authRouter;