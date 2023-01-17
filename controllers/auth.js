import { PrismaClient } from '@prisma/client';
import bycrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
import config from '../config/app.js';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const { sign, verify } = pkg;
const prisma = new PrismaClient();

export const login = async ( req, res ) => {
    try {
        const {username, password} = req.body;

        // Check If Username Exist
        const getUserByUsernameAndPassword = await prisma.user.findFirst({
            where: {
                username
            }
        });
        if(getUserByUsernameAndPassword !== null) {
            // Check Password
            const isPasswordMatch = bycrypt.compareSync(password, getUserByUsernameAndPassword.password);

            if(isPasswordMatch) {
                const accessToken = sign({
                    userId: getUserByUsernameAndPassword.id
                }, config.ACCESS_TOKEN_SECRET, {
                    // expiresIn: '10m'
                });

                const refresh_token = sign({
                    userId: getUserByUsernameAndPassword.id
                }, config.REFRESH_TOKEN_SECRET);

                // Insert New Token
                await prisma.jwt.create({
                    data: {
                        user_id: getUserByUsernameAndPassword.id,
                        refresh_token,
                    }
                });

                res.send({
                    message: 'SUCCESS',
                    data: {
                        accessToken,
                        refresh_token,
                        username: getUserByUsernameAndPassword.username,
                        name: getUserByUsernameAndPassword.name,
                        photo: getUserByUsernameAndPassword.photo,
                        joinedSince: getUserByUsernameAndPassword.created_at,
                    }
                });
                return;
            }
            res.send({
                message: 'Wrong Username / Password',
                data: null
            });
            return;
        }

        res.send({
            message: 'No User Found',
            data: null
        });
    } catch (error) {
        res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const logout = async ( req, res ) => {
    try {
        const {refreshToken} = req.body;
        const {userId} = res.locals.payload;

        await prisma.jwt.deleteMany({
            where: {
                user_id: userId,
                refresh_token: refreshToken
            }
        });
        res.send({
            message: `SUCCESS`,
            data: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const refreshToken = async ( req, res ) => {
    try {
        const {refreshToken} = req.body;

        const getJwtByUserIdAndToken = await prisma.jwt.findFirst({
            where: {
                refresh_token: refreshToken,
            },
        });

        if(getJwtByUserIdAndToken !== null) {
            verify(refreshToken, config.REFRESH_TOKEN_SECRET);

            const accessToken = sign({
                userId: getJwtByUserIdAndToken.user_id
            }, config.ACCESS_TOKEN_SECRET, {
                expiresIn: '10m'
            });

            const refresh_token = sign({
                userId: getJwtByUserIdAndToken.user_id
            }, config.REFRESH_TOKEN_SECRET);

            await prisma.jwt.deleteMany({
                where: {
                    user_id: getJwtByUserIdAndToken.user_id,
                    refresh_token: refreshToken,
                }
            });

            await prisma.jwt.create({
                data: {
                    user_id: getJwtByUserIdAndToken.user_id,
                    refresh_token,
                }
            });

            res.send({
                message: `SUCCESS`,
                data: {
                    accessToken,
                    refresh_token
                }
            });
            return;
        } 

        res.send({
            message: 'No Token Found',
            data: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const register = async ( req, res ) => {
    try {
        const {username, password} = req.body;

        // Check If Theres User With Given Username
        const getUserByUsername = await prisma.user.findFirst({
            where: {
                username
            },
        });

        // If No Then Good To Go
        if(getUserByUsername === null) {
            const hashedPassword = bycrypt.hashSync(password, 10);

            const shortName = uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: ' ',
                seed: 120498,
            });

            await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    name: shortName
                }
            });

            res.send({
                message: `SUCCESS`,
                data: null
            });
            return;
        } 

        res.send({
            message: 'Username Already Exist',
            data: null
        });
    } catch (error) {
        res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}