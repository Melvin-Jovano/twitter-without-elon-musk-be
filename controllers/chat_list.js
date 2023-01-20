import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getChatLists = async (req, res) => {
    try {
        const {userId} = res.locals.payload;
        const dataPerPage = (req.query.limit !== undefined) 
            ? Number(req.query.limit)
            : 10;

        const getChatListByUserId = await prisma.chat_list.findMany({
            orderBy: [
                {id: 'asc'}
            ],
            take: dataPerPage+1,
            where: {
                user_id: userId,
                id: {
                    gte: Number(req.query.last_id || '0')
                }
            },
            select: {
                group_id: true,
                id: true
            }
        });

        let lastId = null;

        if(getChatListByUserId.length > dataPerPage) {
            lastId = getChatListByUserId.pop().id;
        }

        return res.status(200).send({
            message: 'SUCCESS',
            data: {
                data: getChatListByUserId,
                lastId
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const addChatList = async (req, res) => {
    try {
        const {userIds, name} = req.body;
        const {userId} = res.locals.payload;

        userIds.push(userId);

        const createGroup = await prisma.group_chat.create({
            data: {
                name,
                photo: '/images/group_default.png'
            }
        });

        const data = userIds.map(userId => {
            return {
                user_id: userId,
                group_id: createGroup.id
            }
        });

        // Transaction
        await prisma.$transaction([
            prisma.user_group_chat.createMany({
                data
            }),
            prisma.chat_list.createMany({
                data
            }),
        ]);

        return res.status(200).send({
            message: 'SUCCESS',
            data: name
        });
    } catch (error) {
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}