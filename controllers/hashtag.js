import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHashtags = async ( req, res ) => {
    try {
        const {limit} = req.query;

        const hashtags = await prisma.hashtag.groupBy({
            take: Number(limit || 10),
            by: ['hashtag'],
            _count: true,
            orderBy: [{
                _count: {
                    hashtag: 'desc'
                }
            }]
        });

        return res.status(200).send({
            message: `SUCCESS`,
            data: hashtags
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}