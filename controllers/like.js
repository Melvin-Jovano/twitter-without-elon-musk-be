import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likePost = async ( req, res ) => {
    try {
        const {postId} = req.params;
        const {userId} = res.locals.payload;
        let data = null;

        const checkLikeIfExist = await prisma.like.findFirst({
            where: {
                user_id: userId,
                post_id: Number(postId)
            }
        });

        if(checkLikeIfExist === null) {
            data = await prisma.like.create({
                data: {
                    post_id: Number(postId),
                    user_id: userId
                },
                select: {
                    post: {
                        select: {
                            id: true,
                            _count: {
                                select: {
                                    likes: true
                                }
                            }
                        }
                    }
                }
            });
        } else {
            data = await prisma.like.delete({
                where: {
                    id: checkLikeIfExist.id
                },
                select: {
                    post: {
                        select: {
                            id: true,
                            _count: {
                                select: {
                                    likes: true
                                }
                            }
                        }
                    }
                }
            });
            data.post._count.likes -= 1;
        }

        return res.status(200).send({
            message: `SUCCESS`,
            data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}