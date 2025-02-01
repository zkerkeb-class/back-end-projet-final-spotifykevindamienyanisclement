const path = require('path');
const fs = require('fs');
import multer from 'multer';
import { checkFileType } from './upload';
import ffmpeg from 'fluent-ffmpeg';
import { ISound, ISoundCreate } from '../types/interfaces/sound.interface';

// Set storage engine
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        // Créer un nom de dossier unique avec timestamp
        const timestamp = Date.now();
        const uploadDir = path.join(
            __dirname,
            '../../uploads/audio',
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
// Upload audio
// Initialize upload
const uploadAudio = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req: any, file: any, cb: any) => {
        const filetypes = /mp3|wav|flac|ogg|webm|aac|alac|aiff|dsd|mpeg/;
        checkFileType(file, cb, filetypes);
    },
}).single('audio');

const getRelativePath = (absolutePath: string): string => {
    try {
        // Obtenir le chemin de la racine du projet
        const projectRoot = path.resolve(__dirname, '../../');

        console.log('projectRoot', projectRoot);
        console.log('absolutePath', absolutePath);

        // Obtenir le chemin relatif
        const relativePath = path.relative(projectRoot, absolutePath);

        console.log('relativePath', relativePath);

        // Normaliser les séparateurs de chemin (utiliser des forward slashes)
        return relativePath.split(path.sep).join('/');
    } catch (error: any) {
        console.error(`getRelativePath error 1: ${error.message}`);
        throw new Error(error.message);
    }
};

interface IAudioFormat {
    filename: string;
    relativePath: string;
}

interface IAudioFormats {
    m4aAudio: IAudioFormat;
    originalAudio: IAudioFormat;
    wavAudio: IAudioFormat;
}

const formatAudio = async (file: any): Promise<ISoundCreate> => {
    try {
        var metadatas: IAudioFormats = {
            m4aAudio: {
                filename: '',
                relativePath: '',
            },
            originalAudio: {
                filename: '',
                relativePath: '',
            },
            wavAudio: {
                filename: '',
                relativePath: '',
            },
        };
        metadatas.originalAudio = {
            filename: file.filename,
            relativePath: getRelativePath(file.path),
        };

        // const m4aAudio: any = await changeAudioFormat(file, 'm4a');
        // metadatas.m4aAudio = {
        //     filename: m4aAudio.filename,
        //     relativePath: getRelativePath(m4aAudio.path),
        // };
        // console.log('formattedaudio', m4aAudio);

        const wavAudio: any = await changeAudioFormat(file, 'wav');
        console.log('wav Audio', wavAudio);
        metadatas.wavAudio = {
            filename: wavAudio.filename,
            relativePath: getRelativePath(wavAudio.path),
        };

        const duration = await getAudioDuration(file.path);

        return {
            originalSoundName: metadatas.originalAudio?.filename,
            originalSoundURL: metadatas.originalAudio?.relativePath,
            wavSoundName: metadatas.wavAudio?.filename,
            wavSoundURL: metadatas.wavAudio?.relativePath,
            m4aSoundName: '',
            m4aSoundURL: '',
            duration, // Ajouter la durée ici
        };
    } catch (error: any) {
        console.error(`format audio error 2 : ${error.message}`);
        throw new Error(error.message);
    }
};

const changeAudioFormat = async (file: any, format: string) => {
    const inputPath = file.path;
    const parsedFile = path.parse(file.filename);
    const outputPath = path.join(
        path.dirname(inputPath),
        `converted-${parsedFile.name}.${format}`,
    );

    console.log('format', format);
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(inputPath)
            .toFormat(format)
            .on('error', (error) => {
                reject(
                    new Error(`Erreur de conversion audio: ${error.message}`),
                );
            })
            .on('end', () => {
                const newFile = {
                    ...file,
                    filename: path.basename(outputPath),
                    path: outputPath,
                    mimetype: `audio/${format}`,
                };
                resolve(newFile);
            })
            .save(outputPath);
    });
};
const getAudioDuration = (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const duration = metadata.format.duration;
                if (duration !== undefined) {
                    resolve(duration);
                } else {
                    reject(new Error('Unable to retrieve audio duration'));
                }
            }
        });
    });
};
export { uploadAudio, formatAudio };
