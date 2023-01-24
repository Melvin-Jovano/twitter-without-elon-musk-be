import express from "express";
import { createPosts, getAllPosts, getPostsById, updatePosts, deletePosts, getAllPostsById } from "../controllers/posts.js";
import { checkJWT } from "../middlewares/jwt.js";

const postsRouter = express.Router();

postsRouter.get('/posts', getAllPosts);
postsRouter.get('/posts/:id', getPostsById);
postsRouter.get('/user/posts', checkJWT, getAllPostsById)
postsRouter.post('/posts/', checkJWT, createPosts)
postsRouter.put('/posts/:id', checkJWT, updatePosts)
postsRouter.delete('/posts/:id', checkJWT, deletePosts)

export default postsRouter;