export interface IDataSendMailTransporter {
    to: string;
    from: string;
    subject: string;
    body: string;
    url: string;
    experiedTime?: Date;
}

export interface IAMailTransporterProvider {
    sendMail(data: IDataSendMailTransporter): Promise<void>;
};