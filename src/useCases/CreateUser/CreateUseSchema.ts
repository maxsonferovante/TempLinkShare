import { object, string, setLocale } from 'yup'
import { ptForm } from 'yup-locale-pt'

setLocale(ptForm)

export const createUserSchema = object(
    {
        name: string().required(),
        email: string().email().required(),
        password: string().required()
    },

);