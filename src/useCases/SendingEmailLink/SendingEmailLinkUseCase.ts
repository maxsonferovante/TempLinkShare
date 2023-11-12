import { AppError } from '../../erros/AppError';
import { IAMailTransporterProvider } from '../../providers/IAMailTransporterProvider'
import { ISendingEmailLinkRequestDTO } from './ISendingEmailLinkRequestDTO'

import { IAFilesRepository } from '../../repositories/IAFilesRepository'
import moment from 'moment';


export class SendingEmailLinkUseCase {
    constructor(
        private mailTransporterProvider: IAMailTransporterProvider,
        private filesRepository: IAFilesRepository,
    ) { }

    async execute(data: ISendingEmailLinkRequestDTO): Promise<void> {
        try {
            let file = await this.filesRepository.findById({
                fileId: data.idFile,
                authorID: data.authorId,
            });
            if (!file) {
                throw new AppError('File not found', 404)
            }

            if (moment().isAfter(moment(file.expirationDate))) {
                throw new AppError('File expired', 409)
            }

            if (data.experiedTime !== '') {

                const date = new Date();
                date.setMinutes(date.getMinutes() + Number(data.experiedTime));
                const now = new Date()
                if (date < now) {
                    throw new AppError('The expiration time cannot be earlier than the current date', 409)
                }
                if (date > new Date(now.setDate(now.getMinutes() + Number(process.env.EXPERATION_TIME)))) {
                    throw new AppError(`The expiration time cannot be greater than ${process.env.EXPERATION_TIM} minutes`, 409)
                }
                const newExperationDate = new Date();
                newExperationDate.setMinutes(date.getMinutes() + Number(data.experiedTime));

                file = await this.filesRepository.updateExpirationDate({
                    fileId: file.id,
                    authorId: file.authorId,
                    newExperationDate: newExperationDate,
                });
            }
            await this.mailTransporterProvider.sendMail({
                to: data.email,
                from: data.from,
                subject: 'Temp Link to Share file - Api',
                body: 'Share file',
                url: file.url,
                experiedTime: file.expirationDate,
            });

        } catch (error: any) {
            throw new AppError(error.message, error.statusCode);
        }
    }
}