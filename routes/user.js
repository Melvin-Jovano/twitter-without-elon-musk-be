import express from "express";
import fileUpload from 'express-fileupload';
import { updateUserPhoto, getUser, updateUser, updateUserCover, deleteUserCover, deleteUserPhoto, findUserByUsername } from "../controllers/user.js";
import { checkJWT } from "../middlewares/jwt.js";

const uploadImage = fileUpload({
    createParentPath: true
});

const userRouter = express.Router();

userRouter.put("/user/photo", checkJWT, uploadImage, updateUserPhoto);
userRouter.get("/user", checkJWT, getUser);
userRouter.put("/user/cover", checkJWT, uploadImage, updateUserCover);
userRouter.put("/user", checkJWT, updateUser);
userRouter.get("/user/:username", findUserByUsername);
userRouter.put("/user/delcover", checkJWT, deleteUserCover);
userRouter.put("/user/delphoto", checkJWT, deleteUserPhoto)

export default userRouter;