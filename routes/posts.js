import express from "express";
import { createPosts, getAllPosts, getPostsById, updatePosts, deletePosts } from "../controllers/posts.js";


const postsRouter = express.Router();

postsRouter.get('/posts', getAllPosts);
postsRouter.get('/posts/:id', getPostsById);
postsRouter.post('/posts', createPosts)
postsRouter.put('/posts', updatePosts)
postsRouter.delete('/posts/:id', deletePosts)

export default postsRouter;