import moment from "moment";
import { File } from "../entities/File"


export function filterFileIsAfterNow(files: File[]): File[] {
    const filesExpired = files.filter(file => {
        const expirationDate = moment(file.expirationDate);
        const now = moment();
        return now.isAfter(expirationDate);
    });
    return filesExpired;
}