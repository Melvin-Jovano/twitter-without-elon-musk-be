import express from "express";
import { createPosts, uploadImg, getAllPosts, getPostsById, updatePosts, deletePosts, getAllPostsById } from "../controllers/posts.js";
import { checkJWT } from "../middlewares/jwt.js";
import fileUpload from 'express-fileupload';

const uploadImage = fileUpload({
    createParentPath: true
});

const postsRouter = express.Router();

postsRouter.get('/posts', getAllPosts);
postsRouter.post('/post/upload-img', checkJWT, uploadImage, uploadImg);
postsRouter.get('/posts/:id', checkJWT, getPostsById);
postsRouter.get('/userposts', checkJWT, getAllPostsById);
postsRouter.post('/posts/', checkJWT, createPosts);
postsRouter.put('/posts/:id', checkJWT, updatePosts);
postsRouter.delete('/posts/:id', checkJWT, deletePosts);

export default postsRouter;