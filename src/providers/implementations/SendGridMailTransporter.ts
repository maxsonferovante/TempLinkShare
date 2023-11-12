import nodemailer from 'nodemailer';

import { IAMailTransporter, IDataSendMailTransporter } from "../IAMailTransporter";
import { compileTemplate } from '../../utils/compiledHtml';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: process.env.EMAIL_PORT as string,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASSWORD as string
    }
});

export class SendGridMailTransporter implements IAMailTransporter {
    async sendMail(data: IDataSendMailTransporter): Promise<void> {
        try {
            const templateEmail = await compileTemplate({
                template: 'mailShareLink.html',
                variables: data
            })

            transporter.sendMail({
                to: data.to,
                from: data.email,
                subject: data.subject,
                html: templateEmail
            })

        } catch (error) {
            console.log(error)
            throw new Error('Error to send email')
        }
    }
}