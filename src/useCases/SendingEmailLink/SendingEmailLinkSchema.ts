import { object, string, setLocale } from 'yup'
import { ptForm } from 'yup-locale-pt'

setLocale(ptForm)


export const SendingEmailLinkSchema = object(
    {
        email: string().email().required(),
        idFile: string().uuid().required(),
        experiedTime: string(),
    },
);