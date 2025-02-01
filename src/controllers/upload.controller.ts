import { formatImage } from '../CDN/image';
import { formatAudio } from '../CDN/audio';
import { ISound, ISoundCreate } from '../types/interfaces/sound.interface';
import { IImage, IImageCreate } from '../types/interfaces/image.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const uploadController = {
    uploadAudio: async (req: any, res: any) => {
        const audioUpload = req.file;
        console.log(audioUpload);

        if (!audioUpload) {
            res.status(400).json({
                success: false,
                message: 'Aucun fichier uploadé',
            });
        }

        try {
            const formattedAudio: ISoundCreate = await formatAudio(audioUpload);

            const audio: ISound = await prisma.sound.create({
                data: formattedAudio,
            });

            res.send({
                message: 'File uploaded successfully',
                audio,
            });
        } catch (error: any) {
            console.error(`Change format error: ${error.message}`);
            res.status(400).json({
                success: false,
                message: "Erreur lors du changement de format de l'audio",
            });
        }
    },
    uploadImage: async (req: any, res: any) => {
        // Accéder au fichier uploadé
        const file = req.file;
        console.log(file);

        // Vérifier si un fichier a été uploadé
        if (!file) {
            res.status(400).json({
                success: false,
                message: 'Aucun fichier uploadé',
            });
        }

        // Changer le format de l'image
        try {
            const formattedImage: IImageCreate = await formatImage(file);

            const image: IImage = await prisma.image.create({
                data: formattedImage,
            });

            res.send({
                message: 'File uploaded successfully',
                image,
            });
        } catch (error: any) {
            console.error(`Change format error: ${error.message}`);
            res.status(400).json({
                success: false,
                message: "Erreur lors du changement de format de l'image",
            });
        }
    },
};

export default uploadController;
