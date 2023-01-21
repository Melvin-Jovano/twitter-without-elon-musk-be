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
        console.error(error);
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}