import { verify } from "jsonwebtoken";
import config from "../config/app.js";

export const checkJWT = async (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        if(bearerHeader === undefined) {
            throw Error();
        }

        const token = bearerHeader.split(' ')[1];

        verify(token, config.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err !== null && err.name === 'TokenExpiredError') {
                res.send({
                    message: 'EXPIRED_TOKEN',
                    data: null
                });
                return;
            }
            res.locals.payload = decoded;
            next();
        });
    } catch (error) {
        res.send({
            message: 'INVALID_TOKEN',
            data: null
        });
    }
}