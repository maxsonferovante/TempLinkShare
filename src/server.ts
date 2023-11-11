import { ExpirationServiceCronJob } from "./services/ExpirationService/ExpirarionServiceCronJob"
import { app } from './app';

const port = process.env.PORT || 3000;

// inicia a tarefa de verificação de expiração de arquivos, de acordo com o tempo definido no arquivo .env
// start the task of checking the expiration of files, according to the time defined in the .env file
ExpirationServiceCronJob.getInstance().start();



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});     