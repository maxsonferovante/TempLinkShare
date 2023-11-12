import crypto from 'crypto';



export class CryptoPassword {
    private static instance: CryptoPassword;
    private sald = crypto.randomBytes(128).toString('base64');
    private iterations = 1000;
    private digest = "sha256";
    private constructor() { }

    static getInstance() {
        if (!CryptoPassword.instance) {
            CryptoPassword.instance = new CryptoPassword();
        }
        return CryptoPassword.instance;
    }
    public hashPassword(password: string): string {
        return crypto.pbkdf2Sync(password, this.sald, this.iterations, 64, this.digest).toString();
    }
    public comparePassword(password: string, hashPassword: string): boolean {
        return crypto.pbkdf2Sync(password, this.sald, this.iterations, 64, this.digest).toString() === hashPassword;
    }
}