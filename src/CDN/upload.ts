import multer from 'multer';
import path from 'path';
import logger from '../config/logger';

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req: any, file: any, cb: any) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
        );
    },
});

// Check file type
function checkFileType(file: any, cb: any, filetypes: any) {
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    logger.info('filetypes', filetypes);
    logger.info('mimetype', file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: File type not supported');
    }
}

export { storage, checkFileType };
