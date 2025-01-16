import multer from 'multer';
import path from 'path';
const sharp = require('sharp');
const fs = require('fs');

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
    console.log('filetypes', filetypes);
    console.log('mimetype', file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: File type not supported');
    }
}

export { storage, checkFileType };
