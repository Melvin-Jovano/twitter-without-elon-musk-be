import { PrismaClient } from '@prisma/client';
import bycrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
import config from '../config/app.js';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import { validateUsername } from '../utils/app.js';

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
                    // TODO Uncomment When Production
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

                return res.status(200).send({
                    message: 'SUCCESS',
                    data: {
                        accessToken,
                        refreshToken: refresh_token,
                        userId: getUserByUsernameAndPassword.id,
                        username: getUserByUsernameAndPassword.username,
                        name: getUserByUsernameAndPassword.name,
                        photo: getUserByUsernameAndPassword.photo,
                        joinedSince: getUserByUsernameAndPassword.created_at,
                    }
                });
            }
            return res.status(404).send({
                message: 'No User Found With Given Username / Password',
            });
        }

        return res.status(404).send({
            message: 'No User Found',
        });
    } catch (error) {
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const logout = async ( req, res ) => {
    try {
        const {refreshToken} = req.body;

        await prisma.jwt.deleteMany({
            where: {
                refresh_token: refreshToken
            }
        });
        return res.status(204).send({
            message: `SUCCESS`,
        });
    } catch (error) {
        return res.status(500).send({
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

            return res.status(201).send({
                message: `SUCCESS`,
                data: {
                    accessToken,
                    refresh_token
                }
            });
        } 

        return res.status(404).send({
            message: 'No Token Found',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}

export const register = async ( req, res ) => {
    try {
        const {username, password} = req.body;

        const checkUsername = validateUsername(username);

        if(!checkUsername) {
            return res.status(403).send({
                message: `Invalid Username (No Spaces And All Lowercase)`,
            });
        }

        if(checkUsername === null) {
            return res.status(500).send({
                message : 'An Error Has Occured'
            });
        }

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
                dictionaries: [colors, animals],
                separator: ' ',
            });

            await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    name: shortName,
                    photo: '/images/default.jpeg'
                }
            });

            return res.status(201).send({
                message: `SUCCESS`,
            });
        } 

        return res.status(409).send({
            message: 'Username Already Exist',
        });
    } catch (error) {
        return res.status(500).send({
            message : 'An Error Has Occured'
        });
    }
}