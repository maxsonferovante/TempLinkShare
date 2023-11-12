import * as nodemailer from "nodemailer";

import { IAMailTransporterProvider, IDataSendMailTransporter } from "../IAMailTransporterProvider";
import { compileTemplate } from '../../utils/compiledHtml';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

export class SendGridMailTransporter implements IAMailTransporterProvider {

    async sendMail(data: IDataSendMailTransporter): Promise<void> {
        try {
            const templateEmail = await compileTemplate({
                template: 'mailShareLink.html',
                variables: data
            })
            transporter.sendMail({
                to: data.to,
                from: data.from,
                subject: data.subject,
                html: templateEmail
            }).then((info) => {
                console.log(info.messageId)
            }).catch((error) => {
                console.log(error)
            })
            console.log('Email sent');

        } catch (error) {
            console.log(error)
            throw new Error('Error to send email')
        }
    }
}