import { Server } from "socket.io";
import { createServer } from "http";
import { validateAccessToken } from "../middlewares/jwt_socket.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class SocketLoader {
    constructor(app, port) {
        const server = createServer(app);
        this.io = new Server(server, {
            cors : {
                origin : "*"
            }
        });

        this.socket = this.io.of("/chatting");
        this.io.listen(port);
        this.socket.use(validateAccessToken);

        this.socket.on("connect", (socket) => {
            if (!socket.param.authenticated) {
                socket.emit('auth', false);
                socket.disconnect();
            } else {
                socket.emit('auth', true);

                socket.join('chatting');
                
                socket.on("add-chat", async (body) => {
                    try {
                        const {content, groupId, senderId} = body;

                        // TODO Check If Group Exist
                        const createChat = await prisma.chat.create({
                            data: {
                                content,
                                group_id: groupId,
                                sender_id: senderId
                            },
                            select: {
                                id: true,
                                sender_id: true,
                                group_id: true,
                                content: true,
                                created_at: true,
                                is_read: true,
                                user: {
                                    select: {
                                        photo: true,
                                        name: true
                                    }
                                }
                            }
                        });
                        this.socket.emit('new-chat', createChat);
                    } catch (error) {
                        console.error(error);
                        return;
                    }
                });

                socket.on('read-chat', async (chatIds) => {
                    try {
                        await prisma.chat.updateMany({
                            data: {
                                is_read: true
                            },
                            where: {
                                id: {
                                    in: chatIds
                                }
                            }
                        });
                        this.socket.emit('seen-chat', chatIds);
                    } catch (error) {
                        console.error(error);
                        return;
                    }
                });
            }
        });
    }
}