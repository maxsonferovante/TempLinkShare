export class AppError {
    constructor(
        public readonly message: string,
        public readonly statusCode: number
    ) { }
    create(message: string, statusCode = 400) {
        return new AppError(message, statusCode);
    }
}

export class InvalidParamError extends Error {
    constructor(props: { message: string }) {
        super(props.message);
        this.name = 'InvalidParamError';
        this.stack = new Error().stack;
    }
}