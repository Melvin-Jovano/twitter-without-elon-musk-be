import {PrismaClient} from "@prisma/client";
import path from "path";

const prisma = new PrismaClient()

export const postProfilePicture = (req,res)=>{
    if(!req.files){
        return res.status(400).send({
            message : "No File Uploaded"
        });
    }

    const file = req.files.profile;
    const extension = path.extname(file.name);
    const allowedExt = ['.png', '.jpg', '.jpeg'];
    const fileName = file.md5 + extension;
    const filePath = `./public/images/${fileName}`;
    const fileUrl = `/images/${fileName}`;
    
    if(!allowedExt.includes(extension.toLowerCase())){
        return res.status(422).send({
            message : "Invalid Image"
        })
    }

    file.mv(filePath, async(err)=>{
        if(err){
            return res.status(500).send({
                message : 'An Error Has Occured'
            });
        }

        try{
            const getUserId = res.locals.payload.userId;
            const updatedPicture = await prisma.user.update({
                where: {
                    id: getUserId
                },
                data: {
                    photo: fileUrl
                },
                select: {
                    photo: true
                }
            });

            res.status(201).send({
                message : "Profile Picture Changed",
                data : updatedPicture
            });
        } catch(error){
            res.status(400).send({
                message : "An Error Has Occured",
                data : null
            });
        }
    });
}