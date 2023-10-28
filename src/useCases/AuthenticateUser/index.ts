import { PostgresUserRepository } from "../../repositories/implementations/PostgresUserRepository";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { AuthenticateUserController } from "./AuthenticateUserController";

const postgresUserRepository = new PostgresUserRepository();

const authenticateUserUseCase = new AuthenticateUserUseCase(postgresUserRepository);

const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase);

export { authenticateUserUseCase, authenticateUserController };