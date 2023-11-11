import { Router, Response, Request } from 'express';

import { uploadFileController } from '../useCases/UploadFile';
import { listFilesController } from '../useCases/ListFiles';
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated'

import { uploadInstance } from '../config/multerConfig';

const fileRouter = Router();


fileRouter.use(ensureAuthenticated);

fileRouter.post('/upload',
    uploadInstance.single('file'),
    async (request: Request, response: Response) => {
        return uploadFileController.handle(request, response);
    });

fileRouter.get('/list',
    async (request: Request, response: Response) => {
        return listFilesController.handle(request, response);
    });

export { fileRouter };