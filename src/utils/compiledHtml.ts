import handlebars from 'handlebars'
import fs from 'fs/promises'
import path from 'path'

import { IDataSendMailTransporter } from '../providers/IAMailTransporterProvider'
export interface ICompiledTemplate {
    template: string;
    variables: IDataSendMailTransporter;
}

export async function compileTemplate({ template, variables }: ICompiledTemplate) {
    try {
        const templateFileContent = await fs.readFile(
            path.resolve(__dirname, `../templates/${template}`),
            'utf-8'
        )
        const mailTemplateParse = handlebars.compile(templateFileContent.toString())

        const html = mailTemplateParse(variables)

        return html
    } catch (error) {
        console.log(error)
        throw new Error('Error to compile email template')
    }
}