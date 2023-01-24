import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const getAllFollower = async (req,res)=>{
    try {
        const userId = res.locals.payload.userId;
        const getUserFollower = await prisma.follower.findMany({
            where:{
                user_id : userId
            },
            select:{
                follower:{
                    select:{
                        username : true,
                        name: true,
                        photo: true
                    }
                }
            }
        })
        return res.status(200).send({
            message : "SUCCESS",
            data: getUserFollower
        });
    } catch (error) {
        return res.status(500).send({
            message : error,
        });
    } 
}

export const createFollower = async(req, res)=>{
    try {
        const userId = res.locals.payload.userId
        const followerId = req.body.followerId
        const checkFollower = await prisma.follower.findMany({
            where:{
                AND:{
                    user_id:{
                        equals: userId
                    },
                    follower_id : {
                        equals: followerId
                    }
                }
            }
        })
        if(checkFollower.length > 0){
            return res.status(500).send({
                message : "Duplicate"
            })
        }
        const follower = await prisma.follower.create({
            data:{
                user_id : userId,
                follower_id : followerId
            }
        })
        return res.status(200).send({
            message : "SUCCESS",
        });
    } catch (error) {
        return res.status(500).send({
            message : error,
        });
    }
}