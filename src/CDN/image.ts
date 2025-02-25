const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
import multer from 'multer';
import { checkFileType } from './upload';
import { IImageCreate } from 'src/types/interfaces/image.interface';
import logger from '../config/logger';

// Set storage engine
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        // Créer un nom de dossier unique avec timestamp
        const timestamp = Date.now();
        const uploadDir = path.join(
            __dirname,
            '../../uploads/images',
            `upload_${timestamp}`,
        );

        // Créer le dossier s'il n'existe pas
        fs.mkdirSync(uploadDir, { recursive: true });

        cb(null, uploadDir);
    },
    filename: (req: any, file: any, cb: any) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
        );
    },
});
// Upload image
// Initialize upload
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req: any, file: any, cb: any) => {
        const filetypes = /jpeg|jpg|png|gif|webp|avif/;
        checkFileType(file, cb, filetypes);
    },
}).single('image');

// Optimize image
const optimizeImage = async (
    file: any,
    width: number,
    denomination: string,
) => {
    const filePath = await file.path;
    const optimizedPath = path.join(
        file.destination,
        `optimized-${denomination}-image.webp`,
    );

    try {
        await sharp(filePath)
            .resize({ width: width }) // Redimensionner l'image à une largeur de 800 pixels
            .toFile(optimizedPath);

        file.path = optimizedPath;
        file.filename = `optimized-${denomination}-image.webp`;
        return file;
    } catch (error: any) {
        logger.error(`Optimize error: ${error.message}`);
        throw new Error(error.message);
    }
};

const getRelativePath = (absolutePath: string): string => {
    // Obtenir le chemin de la racine du projet
    const projectRoot = path.resolve(__dirname, '../../');

    // Obtenir le chemin relatif
    const relativePath = path.relative(projectRoot, absolutePath);

    // Normaliser les séparateurs de chemin (utiliser des forward slashes)
    return relativePath.split(path.sep).join('/');
};

const formatImage = async (file: any): Promise<IImageCreate> => {
    try {
        const filePath = getRelativePath(file.path);
        const fileName = path.basename(filePath, path.extname(filePath));

        const formattedImageName = `${fileName}-formatted.webp`;
        const formattedImagePath = path.join(
            path.dirname(filePath),
            formattedImageName,
        );

        await sharp(filePath)
            .resize(800)
            .toFormat('webp')
            .toFile(formattedImagePath);

        const avifImageName = `${fileName}-formatted.avif`;
        const avifImagePath = path.join(path.dirname(filePath), avifImageName);

        await sharp(filePath)
            .resize(800)
            .toFormat('avif')
            .toFile(avifImagePath);

        const smallImageName = `${fileName}-small.webp`;
        const smallImagePath = path.join(
            path.dirname(filePath),
            smallImageName,
        );

        await sharp(filePath)
            .resize(400)
            .toFormat('webp')
            .toFile(smallImagePath);

        const mediumImageName = `${fileName}-medium.webp`;
        const mediumImagePath = path.join(
            path.dirname(filePath),
            mediumImageName,
        );

        await sharp(filePath)
            .resize(800)
            .toFormat('webp')
            .toFile(mediumImagePath);

        const largeImageName = `${fileName}-large.webp`;
        const largeImagePath = path.join(
            path.dirname(filePath),
            largeImageName,
        );

        await sharp(filePath)
            .resize(1200)
            .toFormat('webp')
            .toFile(largeImagePath);

        return {
            originalImageName: file.originalname,
            originalImageURL: filePath,
            formattedImageName,
            formattedImageURL: formattedImagePath,
            avifImageName,
            avifImageURL: avifImagePath,
            smallImageName,
            smallImageURL: smallImagePath,
            mediumImageName,
            mediumImageURL: mediumImagePath,
            largeImageName,
            largeImageURL: largeImagePath,
        };
    } catch (error: any) {
        logger.error(`Change format error: ${error.message}`);
        throw new Error(error.message);
    }
};

// change format of image
const changeImageFormat = async (file: any, format: string) => {
    // Extraire le nom sans extension
    const parsedFile = path.parse(file.filename);
    const nameWithoutExt = parsedFile.name;

    const filePath = await file.path;
    const formatPath = await path.join(
        file.destination,
        `format-${nameWithoutExt}.${format}`, // Utiliser le nom sans extension
    );
    logger.info('formatPath', formatPath);

    try {
        await sharp(filePath)
            .toFormat(format) // Convertir l'image au format original
            .toFile(formatPath);

        file.path = formatPath;
        file.filename = `format-${nameWithoutExt}.${format}`;
        logger.info('file', file);
        return file;
    } catch (error: any) {
        logger.error(`Change format error 1 : ${error.message}`);
        throw new Error(error.message);
    }
};

export { uploadImage, optimizeImage, formatImage };
