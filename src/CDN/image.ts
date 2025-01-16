const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
import multer from 'multer';
import { checkFileType } from './upload';
import { relative } from 'path';

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
        console.error(`Optimize error: ${error.message}`);
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

const formatImage = async (file: any) => {
    try {
        var metadatas = {
            formattedImage: {},
            avifImage: {},
            smallImage: {},
            mediumImage: {},
            largeImage: {},
        };
        const formattedImage = await changeImageFormat(file, 'webp');
        metadatas.formattedImage = {
            filename: file.filename,
            relativePath: getRelativePath(file.path),
        };
        console.log('formattedImage', formattedImage);
        const avifImage = await changeImageFormat(formattedImage, 'avif');
        metadatas.avifImage = {
            filename: avifImage.filename,
            relativePath: getRelativePath(avifImage.path),
        };
        console.log('avifImage', avifImage);
        const smallImage = await optimizeImage(formattedImage, 400, 'small');
        metadatas.smallImage = {
            filename: smallImage.filename,
            relativePath: getRelativePath(smallImage.path),
        };
        console.log('smallImage', smallImage);
        const mediumImage = await optimizeImage(formattedImage, 800, 'medium');
        metadatas.mediumImage = {
            filename: mediumImage.filename,
            relativePath: getRelativePath(mediumImage.path),
        };
        console.log('mediumImage', mediumImage);
        const largeImage = await optimizeImage(formattedImage, 1200, 'large');
        metadatas.largeImage = {
            filename: largeImage.filename,
            relativePath: getRelativePath(largeImage.path),
        };
        console.log('largeImage', largeImage);
        // console.log('optimizedImage', optimizedImage);
        return metadatas;
    } catch (error: any) {
        console.error(`Change format error: ${error.message}`);
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
    console.log('formatPath', formatPath);

    try {
        await sharp(filePath)
            .toFormat(format) // Convertir l'image au format original
            .toFile(formatPath);

        file.path = formatPath;
        file.filename = `format-${nameWithoutExt}.${format}`;
        console.log('file', file);
        return file;
    } catch (error: any) {
        console.error(`Change format error 1 : ${error.message}`);
        throw new Error(error.message);
    }
};

export { uploadImage, optimizeImage, formatImage };
