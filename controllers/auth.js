import { PrismaClient } from '@prisma/client';
import config from '../config/app.js';
import bycrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const login = async ( req, res ) => {
    try {
        const {username, password} = req.body;

        // TODO Check Password First
        const getUserByUsernameAndPassword = await prisma.user.findFirst({
            where: {
                username,
                password
            }
        });

        if(getUserByUsernameAndPassword !== null) {
            res.send({
                message: 'Hello',
                data: null
            });
            return;
        } 

        res.send({
            message: 'Who tf Are You?',
            data: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({message : 'Oops Error'});
    }
}

export const signUp = async ( req, res ) => {
    try {
        const {username, password} = req.body;

        // Check If Theres User With Given Username
        const getUserByUsername = await prisma.user.findFirst({
            where: {
                username
            }
        });

        // If No Then Good To Go
        if(getUserByUsername === null) {
            const hashedPassword = bycrypt.hashSync(password, 10);
            await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword
                }
            });

            res.send({
                message: `Hello ${username}, Welcome To ${config.APP_NAME}`,
                data: null
            });
            return;
        } 

        res.send({
            message: 'Username Already Taken',
            data: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({message : 'Oops Error'});
    }
}