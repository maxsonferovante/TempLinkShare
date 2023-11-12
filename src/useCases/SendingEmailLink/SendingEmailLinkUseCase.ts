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