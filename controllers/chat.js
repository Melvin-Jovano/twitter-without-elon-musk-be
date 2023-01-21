import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addChat = async (req, res) => {
    try {
        const {userId} = res.locals.payload;
        const {content, groupId, senderId} = req.body;

        // TODO Check If Group Exist

        await prisma.chat.create({
            data: {
                content,
                group_id: groupId,
                sender_id: senderId
            }
        });

        return res.status(200).send({
            message: 'SUCCESS',
            data: {
                senderId,
                content
            }
        });
    } catch (error) {
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const getChatByGroupId = async (req, res) => {
    try {
        const groupId = Number(req.params.groupId);
        const dataPerPage = (req.query.limit !== undefined) 
            ? Number(req.query.limit)
            : 10;
        const paging = (req.query.last_id !== undefined) 
            ? {
                id: {
                    lte: Number(req.query.last_id)
                }
            } 
            : {};

        const getChats = await prisma.chat.findMany({
            orderBy: [{id: 'desc'}],
            take: dataPerPage+1,
            where: {
                group_id: groupId,
                ...paging
            },
            select: {
                id: true,
                sender_id: true,
                content: true,
                created_at: true,
                is_read: true
            }
        });

        let lastId = null;

        if(getChats.length > dataPerPage) {
            lastId = getChats.pop().id;
        }

        return res.status(200).send({
            message: 'SUCCESS',
            data: {
                data: getChats,
                lastId
            }
        });
    } catch (error) {
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}