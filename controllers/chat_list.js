import { PrismaClient } from '@prisma/client';
import { chatSocket } from '../index.js';

const prisma = new PrismaClient();

export const getChatLists = async (req, res) => {
    try {
        const {userId} = res.locals.payload;
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

        const getChatListByUserId = await prisma.chat_list.findMany({
            orderBy: [
                {id: 'desc'}
            ],
            take: dataPerPage+1,
            where: {
                user_id: userId,
                ...paging
            },
            select: {
                group: {
                    select: {
                        photo: true,
                        name: true,
                        id: true
                    }
                },
            }
        });

        let groups = getChatListByUserId.map(chatList => {
            return {
                ...chatList.group
            };
        });

        groups = await Promise.all(groups.map(async group => {
            let [username, lastChat, time, isRead] = [null, null, null, false];
            const getUserGroupsByGroupIds = await prisma.user_group_chat.findMany({
                where: {
                    group_id: group.id
                }
            });
            const getLastChatByGroup = await prisma.chat.findFirst({
                orderBy: [{created_at: 'desc'}],
                where: {
                    group_id: group.id
                },
                take: 1
            });

            // Get Last Chat By Group
            if(getLastChatByGroup !== null) {
                lastChat = getLastChatByGroup.content;
                isRead = getLastChatByGroup.is_read;
                time = getLastChatByGroup.created_at;
            }

            // Check How Many Users In The Group
            if(getUserGroupsByGroupIds.length === 2) {
                await Promise.all(getUserGroupsByGroupIds.map(async userGroup => {
                    if(userGroup.user_id !== userId) {
                        const getUserById = await prisma.user.findUnique({
                            where: {
                                id: userGroup.user_id
                            }
                        });
                        if(getUserById !== null) {
                            username = getUserById.username;
                            group.name = getUserById.name;
                            group.photo = getUserById.photo;
                        }
                    }
                }));
            } else if(getUserGroupsByGroupIds.length === 1) {
                const getUserById = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                });
                if(getUserById !== null) {
                    username = getUserById.username;
                    group.name = getUserById.name;
                    group.photo = getUserById.photo;
                }
            }

            return {
                time,
                username,
                lastChat,
                ...group
            }
        }));

        let lastId = null;

        if(groups.length > dataPerPage) {
            lastId = groups.pop().id;
        }

        return res.status(200).send({
            message: 'SUCCESS',
            data: {
                data: groups,
                lastId
            }
        });
    } catch (error) {
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const addChatList = async (req, res) => {
    try {
        const {userIds, name} = req.body;
        const {userId} = res.locals.payload;

        if(!userIds.includes(userId)) {
            userIds.push(userId);
        }

        if(userIds.length === 2) {
            const getGroupByUserIds = await prisma.user_group_chat.groupBy({
                by: ['group_id', 'user_id'],
                where: {
                    user_id: {
                        in: userIds
                    }
                }
            });
            const groupHashmap = {};
            for (const group of getGroupByUserIds) {
                if(groupHashmap[group.group_id] === undefined) {
                    groupHashmap[group.group_id] = 0;
                }
                groupHashmap[group.group_id] += 1;
                if(groupHashmap[group.group_id] === 2) {
                    return res.status(500).send({
                        message : 'You Already Have A Chat With This User'
                    });
                }
            }
        }

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
        const [_, chatList] = await prisma.$transaction([
            prisma.user_group_chat.createMany({
                data
            }),
            prisma.chat_list.createMany({
                data
            }),
        ]);

        chatSocket.socket.emit('new-chat-list', {
            userIds,
            id: createGroup.id,
            photo: createGroup.photo,
            name
        });

        return res.status(200).send({
            message: 'SUCCESS',
            data: {
                id: createGroup.id,
                photo: createGroup.photo,
                name
            }
        });
    } catch (error) {
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}