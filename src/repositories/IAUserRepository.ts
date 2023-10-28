import { UserCreate, User } from "../entities/User";

export interface IAUserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: UserCreate): Promise<User>;
}