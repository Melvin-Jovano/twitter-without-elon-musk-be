import express from "express";
import fileUpload from 'express-fileupload';
import { updateUserPhoto, updateUser, updateUserCover } from "../controllers/user.js";
import { checkJWT } from "../middlewares/jwt.js";

const uploadImage = fileUpload({
    createParentPath: true
});

const userRouter = express.Router();

userRouter.put("/user/photo", checkJWT, uploadImage, updateUserPhoto);
userRouter.put("/user/cover", checkJWT, uploadImage, updateUserCover);
userRouter.put("/user", checkJWT, updateUser);

export default userRouter;