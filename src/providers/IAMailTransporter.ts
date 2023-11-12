export interface IDataSendMailTransporter {
    to: string;
    subject: string;
    body: string;
    email: string;
}

export interface IAMailTransporter {
    sendMail(data: IDataSendMailTransporter): Promise<void>;
};