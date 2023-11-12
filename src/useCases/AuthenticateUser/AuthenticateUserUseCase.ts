import { IAUserRepository } from "../../repositories/IAUserRepository";
import { CryptoPassword } from "../../utils/cryptoPassword";
import { IAuthenticateUserRequestDTO } from "./IAuthenticateUserRequestDTO";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { sign } from "jsonwebtoken";
import { AppError } from "../../erros/AppError";


export class AuthenticateUserUseCase {
    constructor(
        private userRepository: IAUserRepository
    ) { }

    async execute(data: IAuthenticateUserRequestDTO): Promise<IAuthenticateUserResponseDTO> {
        try {
            const userExist = await this.userRepository.getByEmail(data.email);

            if (!userExist) {
                console.log("senha incorreta")
                throw new AppError("Email or password incorrect!", 404);
            }

            const passwordMatch = CryptoPassword.getInstance().comparePassword(data.password, userExist.password);
            if (!passwordMatch) {
                throw new AppError("Email or password incorrect!", 404);
            }

            const token = sign(
                { id: userExist.id },
                process.env.SECRECT_TOKEN || '',
                { expiresIn: process.env.EXPIRES_IN_TOKEN }
            );

            return {
                user: {
                    id: userExist.id,
                    email: userExist.email,
                },
                token: token,
            };
        } catch (error) {
            throw new AppError("Email or password incorrect!", 404);
        }

    }
}

