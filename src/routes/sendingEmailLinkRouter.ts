import { Router, Response, Request } from 'express';
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated'
import { sendingEmailLinkController } from '../useCases/SendingEmailLink/'


const sendingEmailLinkRouter = Router();

sendingEmailLinkRouter.use(ensureAuthenticated);


sendingEmailLinkRouter.post('/send',
    async (request: Request, response: Response) => {
        return sendingEmailLinkController.handle(request, response);
    });

export { sendingEmailLinkRouter };