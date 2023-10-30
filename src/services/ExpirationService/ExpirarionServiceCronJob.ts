import cron from 'node-cron';
import { ExpirationService } from './ExpirationService';


export class ExpirationServiceCronJob {
    private static instance: ExpirationServiceCronJob;
    private static cronExpression = `*/${process.env.EXPERATION_TIME} * * * *`;
    private expirationService = new ExpirationService();
    private constructor() { }

    static getInstance(): ExpirationServiceCronJob {
        if (!ExpirationServiceCronJob.instance) {
            ExpirationServiceCronJob.instance = new ExpirationServiceCronJob();
        }
        return ExpirationServiceCronJob.instance;
    }

    start() {
        const job = cron.schedule(ExpirationServiceCronJob.cronExpression, () => {
            console.info("Verificando expiração de arquivos...");
            this.expirationService.getExpiredFiles();
        }, {
            scheduled: true,
            timezone: "America/Sao_Paulo"

        });
        job.start();
    }
}