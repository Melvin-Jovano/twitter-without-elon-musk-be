import express from "express";
import { createPosts, uploadImg, getAllPosts, getPostsById, updatePosts, deletePosts, getAllPostsById } from "../controllers/posts.js";
import { checkJWT } from "../middlewares/jwt.js";
import fileUpload from 'express-fileupload';

const uploadImage = fileUpload({
    createParentPath: true
});

const postsRouter = express.Router();

postsRouter.get('/posts', getAllPosts);
postsRouter.post('/post/upload-img', uploadImage, uploadImg);
postsRouter.get('/posts/:id', getPostsById);
postsRouter.get('/user/posts', checkJWT, getAllPostsById)
postsRouter.post('/posts/', checkJWT, createPosts)
postsRouter.put('/posts/:id', checkJWT, updatePosts)
postsRouter.delete('/posts/:id', checkJWT, deletePosts)

export default postsRouter;