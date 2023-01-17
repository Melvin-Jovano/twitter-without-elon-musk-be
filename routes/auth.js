import express from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.js";
import { checkJWT } from "../middlewares/jwt.js";

const authRouter = express.Router();

authRouter.post('/auth/login', login);
authRouter.put('/auth/register', register);
authRouter.delete('/auth/logout', checkJWT, logout);
authRouter.put('/auth/refresh', refreshToken);

export default authRouter;