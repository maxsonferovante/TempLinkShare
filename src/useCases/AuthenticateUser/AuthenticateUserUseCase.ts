import { IAUserRepository } from "../../repositories/IAUserRepository";
import { CryptoPassword } from "../../utils/cryptoPassword";
import { IAuthenticateUserRequestDTO } from "./IAuthenticateUserRequestDTO";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { JwtPayload, decode, sign } from "jsonwebtoken";
import { AppError } from "../../erros/AppError";
import { encode } from "punycode";

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
    async refreshtoken(token: string) {
        try {

            const decodedToken = decode(token,{ complete: true}) as JwtPayload
            
            if (!decodedToken) {
                throw new AppError('Token invalid', 401);
            }

            const user = await this.userRepository.findById(decodedToken.payload.id);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            
            if (decodedToken.payload.exp < Math.floor(Date.now() / 1000) + 60 * 60){
                const newToken = sign(
                    { id: user.id },
                    process.env.SECRECT_TOKEN || '',
                    { expiresIn: process.env.EXPIRES_IN_TOKEN }
                );
    
                return {
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                    token: newToken,
                    messsage : "Token refreshted with success!"
                }; 
            }
            else{
                return {
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                    token: token,
                    messsage : "Token is valid"
                };
            }
        } catch (error) {
            throw new AppError('Token invalid', 401);
        }
    }
}

