import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { localData } from '../constant';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// The disk storage engine gives you full control on storing files to disk.
const fileStorage = multer.diskStorage({
    destination: (
        request: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        callback(null, localData);
    },

    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: FileNameCallback
    ): void => {
        callback(null, file.originalname);
    },
});

const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

export const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
}).single('file');

// The memory storage engine stores the files in memory as Buffer objects.
// const _memStorage = multer.memoryStorage();
// const upload2Mem = multer({storage: _memStorage}).single('file');
// const upload = process.env.NODE_ENV !== 'production' ? upload2Mem : upload2Disk;

// const parser = new DatauriParser();
// /**
//  * @description This function converts the buffer to data url
//  * @param {Object} req containing the field object
//  * @returns {String} The data url from the string buffer
//  */
// const dataUri = (req: Request) => {
//     const extName = path.extname(req.file.originalname).toString();
//     return parser.format(extName, req.file.buffer);
// };
