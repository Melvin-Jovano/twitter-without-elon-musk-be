import { verify } from "jsonwebtoken";
import config from "../config/app.js";

export const validateAccessToken = async (socket, next) => {

    try {
        const token = socket.handshake.query.token?.toString() || "";
        const payload = verify(token, config.ACCESS_TOKEN_SECRET);
        // console.log(socket.handshake.query.room);
        socket.token = payload;
        socket.param = {
            authenticated : true,
        };
        next();
    } catch (err) {
        socket.param = {
            authenticated : false
        };
        next();
    }
}