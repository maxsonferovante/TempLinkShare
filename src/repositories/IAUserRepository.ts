import { userCreatedResponse, UserCreate, User } from "../entities/User";

export interface IAUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    save(user: UserCreate): Promise<userCreatedResponse>;
}