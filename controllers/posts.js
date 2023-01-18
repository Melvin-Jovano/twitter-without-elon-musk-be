import {PrismaClient} from "@prisma/client";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// get all post
export const getAllPosts = async (req, res) => {
    try{
        const response = await prisma.post.findMany();
        return res.status(200).send({
            message : "get all post success",
            data: response
        });
    } catch(err){
        return res.status(500).send({
            message : err,
        });
    }
}

// get post by id
export const getPostsById = async (req, res) => {
    try{
        const response = await prisma.post.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.status(200).send({
            message : "get all post success",
            data: response
        });
    } catch(err){
        return res.status(500).send({
            message : err,
        });
    }
}

// create posts
export const createPosts = async (req, res) => {
    try{
        const posts = await prisma.post.create({
            data: { 
                content: req.body.content,
                user_id: res.locals.payload.userId
            }
        })
        console.log(posts);
        return res.json(posts)
    } catch(err){
        console.log(err);
        return res.status(400).send({
            message : "error",
        });
    }
}