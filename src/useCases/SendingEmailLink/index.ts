import { SendingEmailLinkController } from './SendingEmailLinkController';
import { SendingEmailLinkUseCase } from './SendingEmailLinkUseCase';
import { SendGridMailTransporter } from '../../providers/implementations/SendGridMailTransporter';
import { PostgresFileRepository } from '../../repositories/implementations/PostgresFileRepository';

const sendGridMailTransporter = new SendGridMailTransporter();
const postgresFileRepository = new PostgresFileRepository();


const sendingEmailLinkUseCase = new SendingEmailLinkUseCase(
    sendGridMailTransporter,
    postgresFileRepository
);

const sendingEmailLinkController = new SendingEmailLinkController(
    sendingEmailLinkUseCase
);

export { sendingEmailLinkController };