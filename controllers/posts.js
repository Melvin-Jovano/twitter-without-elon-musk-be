import {PrismaClient} from "@prisma/client";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const uploadImg = async (req, res) => {
    try{
        if(!req.files){
            return res.status(400).send({
                message : "No File Uploaded"
            });
        }
    
        const file = req.files.img;
        const extension = path.extname(file.name);
        const allowedExt = ['.png', '.jpg', '.jpeg'];
        const fileName = uuidv4() + extension;
        const filePath = `./public/images/${fileName}`;
        const fileUrl = `/images/${fileName}`;
        
        if(!allowedExt.includes(extension.toLowerCase())){
            return res.status(403).send({
                message : "Invalid Image"
            });
        }
    
        file.mv(filePath, async(err)=>{
            if(err){
                return res.status(500).send({
                    message : 'An Error Has Occured'
                });
            }
    
            try {
                return res.status(200).send({
                    message : "SUCCESS",
                    data : fileUrl
                });
            } catch(error){
                return res.status(500).send({
                    message : "An Error Has Occured",
                });
            }
        });
    } catch(err){
        return res.status(500).send({
            message : err,
        });
    }
}

// get all post
export const getAllPosts = async (req, res) => {
    try{
        let { page, limit } = req.query
        const skip = (page - 1) * limit
        const response = await prisma.post.findMany({
            take: parseInt(limit),
            skip: skip,
            select: {
                id: true,
                content: true,
                img: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        photo: true,
                        name: true
                    }
                }
            }
        })
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

//get all posts by id
export const getAllPostsById = async (req, res) => {
    try{
        let { page, limit } = req.query
        const skip = (page - 1) * limit
        const response = await prisma.post.findMany({
            take: parseInt(limit),
            skip: skip,
            where:{
                user_id : res.locals.payload.userId
            },
            select: {
                content: true,
                img: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        photo: true,
                        name: true
                    }
                }
            }
        })
        return res.status(200).send({
            message : "SUCCESS",
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
                id: Number(req.params.id),
            },
            select: {
                content: true,
                img: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        photo: true,
                        name: true
                    }
                }
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
    const {content, img} = req.body
    const {userId} = res.locals.payload;

    try{
        const posts = await prisma.post.create({
            data: { 
                img,
                content: content,
                user_id: userId
            }
        })
        return res.status(200).send({
            message : "Create new post success",
            data: posts
        });
    } catch(err) {
        console.error(err);
        return res.status(400).send({
            message : "error",
        });
    }
}

// edit post
export const updatePosts = async (req, res) => {
    try {
        const posts = await prisma.post.update({
            where: {
                id: Number(req.params.id)
            },
            data: { 
                content: req.body.content,
                img: req.body.img
            }
        })
        return res.json(posts)
    } catch(err) {
        return res.status(400).send({
            message : "error",
        });
    }
}

// delete posts
export const deletePosts = async (req, res) => {
    try {
        const posts = await prisma.post.delete  ({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).send({
            message : "Post deleted successfully",
            data: posts
        });
    } catch(err) {
        return res.status(400).send({
            message : "error",
        });
    }
}