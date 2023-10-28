import { object, string, setLocale } from "yup";
import { ptForm } from "yup-locale-pt";

setLocale(ptForm);

export const AuthenticateUserSchema = object({
    email: string().email().required(),
    password: string().required(),
});
