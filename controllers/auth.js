import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async ( req, res ) => {
    try {
        const {username, password} = req.body;

        // TODO Encrypt Password First
        const getUserByUsernameAndPassword = await prisma.user.findFirst({
            where: {
                username,
                password
            }
        });

        if(getUserByUsernameAndPassword !== null) {
            res.send({
                message: 'Hello'
            });
            return;
        } 

        res.send({
            message: 'Who tf Are You?'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({message : 'Oops Error'});
    }
}