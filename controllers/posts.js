import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// get all post
export const getAllPosts = async (req, res) => {
    try{
        let { page, limit } = req.query
        const skip = (page - 1) * limit
        const response = await prisma.post.findMany({
            take: parseInt(limit),
            skip: skip,
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
        console.log(err);
        return res.status(500).send({
            message : err,
        });
    }
}

// create posts
export const createPosts = async (req, res) => {
    const {content, img} = req.body
    const userId = res.locals.payload;
    try{
        const posts = await prisma.post.create({
            data: { 
                content,
                img,
                user_id: userId.userId
            }
        })
        return res.status(200).send({
            message : "Create new post success",
            data: posts
        });
    } catch(err){
        console.log(err);
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