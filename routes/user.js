import express from "express";
import fileUpload from 'express-fileupload';
import { updateUserPhoto } from "../controllers/user.js";
import { checkJWT } from "../middlewares/jwt.js";

const uploadImage = fileUpload({
    createParentPath: true
});

const routerProfilePic = express.Router();

routerProfilePic.put("/user", checkJWT, uploadImage, updateUserPhoto);

export default routerProfilePic;