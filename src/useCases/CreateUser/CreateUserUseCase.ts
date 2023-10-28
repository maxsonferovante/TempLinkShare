import { hash } from 'bcrypt'

import { UserCreate } from "../../entities/User";
import { AppError } from "../../erros/AppError";
import { ICreateUserRequestDTO } from "./ICreateUserRequestDTO";
import { IAUserRepository } from "../../repositories/IAUserRepository";




export class CreateUserUseCase {
    constructor(
        private usersRepository: IAUserRepository,
    ) { }

    async execute(data: ICreateUserRequestDTO) {
        try {
            const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

            if (userAlreadyExists) {
                throw new AppError("User already exists!", 409);
            }
            const passwordHash = await hash(data.password, 8);

            const user: UserCreate = {
                name: data.name,
                email: data.email,
                password: passwordHash,
            };
            const userCreated = await this.usersRepository.save(user);
            return userCreated;
        } catch (error: any) {
            throw new AppError(error.message, error.statusCode);
        }

    }
}
