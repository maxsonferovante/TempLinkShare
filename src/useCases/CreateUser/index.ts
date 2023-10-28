import { PostgresUserRepository } from "../../repositories/implementations/PostgresUserRepository";

import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";


const postgresUserRepository = new PostgresUserRepository();


const createUserUseCase = new CreateUserUseCase(postgresUserRepository);

const createUserController = new CreateUserController(createUserUseCase);

export { createUserUseCase, createUserController };