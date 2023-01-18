import express from "express";
import { createPosts, getAllPosts, getPostsById } from "../controllers/posts.js";


const postsRouter = express.Router();

postsRouter.get('/posts', getAllPosts);
postsRouter.get('/posts/:id', getPostsById);
postsRouter.post('/posts', createPosts)

export default postsRouter;