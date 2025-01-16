import { formatImage } from '../CDN/image';
import { formatAudio } from '../CDN/audio';

const uploadController = {
    uploadAudio: async (req: any, res: any) => {
        const audio = req.file;
        console.log(audio);

        if (!audio) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier uploadé',
            });
        }

        try {
            const formattedAudio = await formatAudio(audio);
            console.log(formattedAudio);
            return res.send({
                message: 'File uploaded successfully',
                formattedAudio,
            });
        } catch (error: any) {
            console.error(`Change format error: ${error.message}`);
            return res.status(400).json({
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
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier uploadé',
            });
        }

        // Changer le format de l'image
        try {
            const formattedImage = await formatImage(file);
            return res.send({
                message: 'File uploaded successfully',
                formattedImage,
            });
        } catch (error: any) {
            console.error(`Change format error: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: "Erreur lors du changement de format de l'image",
            });
        }
    },
};

export default uploadController;
