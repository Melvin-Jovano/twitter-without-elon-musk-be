import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addChatList = async (req, res) => {
    try {
        const {userIds, name} = req.body;
        const {userId} = res.locals.payload;

        userIds.push(userId);

        // Transaction
        const [posts, totalPosts] = await prisma.$transaction([
            prisma.post.findMany({ where: { title: { contains: 'prisma' } } }),
            prisma.post.count(),
        ]);

        const createGroup = await prisma.groupChat.create({
            data: {
                name
            }
        });

        const data = userIds.map(userId => {
            return {
                user_id: userId,
                group_id: createGroup.id
            }
        });

        await prisma.userGroupChat.createMany({
            data
        });

        const createChatList = await prisma.chatList.create({
            data: {
                group_id: createGroup.id,
                user_id: userIds
            }
        });

        return res.status(200).send({
            message: 'SUCCESS',
            data: name
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}