import express from "express";
import fileUpload from 'express-fileupload';
import { postProfilePicture } from "../controllers/profile.js";
import { checkJWT } from "../middlewares/jwt.js";

const uploadImage = fileUpload({
    createParentPath: true
});

const routerProfilePic = express.Router();

routerProfilePic.post("/newprofilepicture", checkJWT, uploadImage,postProfilePicture)

export default routerProfilePic;