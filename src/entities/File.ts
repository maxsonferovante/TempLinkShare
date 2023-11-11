export interface File {
    id: string;
    name: string;
    url: string;
    expirationDate: Date;
    expired: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
}

export interface FileCreate {
    name: string;
    url: string;
    expirationDate: Date;
    authorId: string;
}

export class FileModel implements File {
    id: string;
    name: string;
    url: string;
    expirationDate: Date;
    expired: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;

    constructor(
        id: string,
        name: string,
        url: string,
        expirationDate: Date,
        expired: boolean,
        createdAt: Date,
        updatedAt: Date,
        authorId: string
    ) {
        this.id = id;
        this.name = name || "";
        this.url = url;
        this.expirationDate = expirationDate;
        this.expired = expired || false;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorId = authorId;
    }
}