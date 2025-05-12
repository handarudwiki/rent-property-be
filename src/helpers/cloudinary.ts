import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const upload = async (filepath:string)  =>{
   const uploadResult = await cloudinary.uploader.upload(filepath,{
    folder: 'propertie_photos',
   } )

    return uploadResult.public_id
}

export const getUrl = (publicId:string) => {
    const url = cloudinary.url(publicId, {
        quality: 'auto',
        fetch_format: 'auto',
    });
    return url;
}


export const deleteImage = async (publicId:string) => {
    await cloudinary.uploader.destroy(publicId);
}

