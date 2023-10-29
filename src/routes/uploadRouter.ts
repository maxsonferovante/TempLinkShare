import { Router, Response, Request } from 'express';

import { uploadFileController } from '../useCases/UploadFile/';
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated'

import { uploadInstance } from '../config/multerConfig';

const uploadRouter = Router();

uploadRouter.post('/upload',
    ensureAuthenticated,
    uploadInstance.single('file'),
    async (request: Request, response: Response) => {
        return uploadFileController.handle(request, response);
    });

export { uploadRouter };