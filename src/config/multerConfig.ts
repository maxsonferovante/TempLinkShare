import multer from 'multer';


export const uploadInstance = multer(
    {
        limits: {
            fileSize: 1024 * 1024 * 100 // 100mb
        }
    }
);
