import multer from 'multer';


export const uploadInstance = multer(
    {
        limits: {
            fileSize: 1024 * 1024 * Number(process.env.LIMIT_SIZE) // 200mb

        }
    }
);
