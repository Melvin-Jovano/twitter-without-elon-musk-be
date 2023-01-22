import { Server } from "socket.io";
import { createServer } from "http";
import { validateAccessToken } from "../middlewares/jwt_socket.js";

export default class SocketLoader {
    io;
    socket;

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

        this.socket.on("connection", (socket) => {
            if (!socket.param.authenticated) {
                socket.emit('authenticated', false);
                socket.disconnect();
            } else {
                socket.emit('authenticated', true);

                socket.join(socket.param.room);
                
                socket.on("send-message", async (data) => {
                    try {
                        console.log(data);
                    } catch (error) {
                        console.error(error);
                    }
                });

                socket.on('delete-messages', async (data) => {
                    try {
                        console.log(data);
                    } catch (error) {
                        console.error(error);
                    }
                });
            }
        });
    }
}