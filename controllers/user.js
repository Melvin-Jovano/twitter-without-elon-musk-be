import {PrismaClient} from "@prisma/client";
import path from "path";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getUser = async (req, res)=>{
    try {
        const dataPerPage = (req.query.limit !== undefined) 
            ? Number(req.query.limit)
            : 15;

        if(req.query.name === undefined && req.query.username === undefined) {
            const {userId} = res.locals.payload;

            const getUserById = await prisma.user.findUnique({
                select: {
                    username: true,
                    name: true,
                    cover: true,
                    photo: true,
                    location: true,
                    bio: true,
                    created_at: true
                },
                where: {
                    id: userId
                }
            });

            return res.status(200).send({
                message : "SUCCESS",
                data: getUserById
            });
        }

        const username = (req.query.username) 
            ?  {
                username: {
                    contains : req.query.username,
                }
            }
            : {};

        const name = (req.query.name) 
            ?  {
                name: {
                    contains : req.query.name,
                }
            }
            : {};

        const getUser = await prisma.user.findMany({
            orderBy: [
                {id: 'asc'}
            ],
            select: {
                username: true,
                name: true,
                id: true,
                photo: true
            },
            where: {
                ...name,
                ...username,
                id: {
                    gte: Number(req.query.last_id || '0')
                }
            },
            take: dataPerPage+1,
        });

        let lastId = null;

        if(getUser.length > dataPerPage) {
            lastId = getUser.pop().id;
        }

        return res.status(200).send({
            message : "SUCCESS",
            data: {
                data: getUser,
                lastId
            }
        });
    } catch(error) {
        console.error(error);
        return res.status(500).send({
            message : "An Error Has Occured",
        });
    }
}


export const updateUser = async (req, res)=>{
    try {
        const {bio, name, location} = req.body;
        const {userId} = res.locals.payload;

        if(typeof name === 'string' && name.length < 1) {
            return res.status(403).send({
                message : "Name Must Not Empty",
            });
        }

        await prisma.user.update({
            data: {
                bio,
                name,
                location
            },
            where: {
                id: userId
            }
        });

        return res.status(200).send({
            message : "SUCCESS",
        });
    } catch(error){
        return res.status(500).send({
            message : "An Error Has Occured",
        });
    }
}

export const updateUserCover = (req, res)=>{
    if(!req.files){
        return res.status(400).send({
            message : "No File Uploaded"
        });
    }

    const file = req.files.cover;
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
            const getUserId = res.locals.payload.userId;
            const updatedPicture = await prisma.user.update({
                where: {
                    id: getUserId
                },
                data: {
                    cover: fileUrl,
                },
                select: {
                    cover: true
                }
            });

            return res.status(200).send({
                message : "SUCCESS",
                data : updatedPicture.cover
            });
        } catch(error){
            return res.status(500).send({
                message : "An Error Has Occured",
            });
        }
    });
}

export const updateUserPhoto = (req, res)=>{
    if(!req.files){
        return res.status(400).send({
            message : "No File Uploaded"
        });
    }

    const file = req.files.photo;
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
            const getUserId = res.locals.payload.userId;
            const updatedPicture = await prisma.user.update({
                where: {
                    id: getUserId
                },
                data: {
                    photo: fileUrl,
                },
                select: {
                    photo: true
                }
            });

            return res.status(200).send({
                message : "SUCCESS",
                data : updatedPicture.photo
            });
        } catch(error){
            return res.status(500).send({
                message : "An Error Has Occured",
            });
        }
    });
}

export const deleteUserCover = (req,res)=>{
    const file = req.body.cover;
    const filePath = `public${file}`;

    fs.unlink(filePath, async(err)=>{
        if(err){
            return res.status(500).send({
                message : 'An Error Has Occured' + err
            });
        }

        try {
            const getUserId = res.locals.payload.userId;
            const deleteCover = await prisma.user.update({
                where:{
                    id : getUserId 
                },
                data:{
                    cover : ""
                },
                select:{
                    cover: true
                }
            })

            return res.status(200).send({
                message : "SUCCESS"
            });
        } catch (error) {
            return res.status(500).send({
                message : "An Error Has Occured",
            });
        }
    })
}

export const deleteUserPhoto = (req, res)=>{
    const file = req.body.oldImg;
    const filePath = `public${file}`;

    fs.unlink(filePath, (err)=>{
        if(err){
            return res.status(500).send({
                message : 'An Error Has Occured' + err
            });
        }
    })
}