export interface IAuthenticateUserResponseDTO {
    user: {
        id: string;
        email: string;

    };
    token: string;
}