import { IAUserRepository } from "../IAUserRepository";
import { User, UserModel, UserCreate, userCreatedResponse } from "../../entities/User";

import { PrismaClient } from "@prisma/client";
import { AppError } from "../../erros/AppError";

const prisma = new PrismaClient();

export class PostgresUserRepository implements IAUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        try {
            const userExist = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (userExist !== null) {
                throw new AppError("User already exists", 409);
            }
            return userExist;
        } catch (error: any) {
            console.log(error);
            throw new AppError(error.message, error.statusCode);
        }
    }
    async save(user: UserCreate): Promise<userCreatedResponse> {
        try {
            await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                }
            });
            const userCreatePrisma = await prisma.user.findFirstOrThrow({
                where: {
                    email: user.email,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            const newUser: userCreatedResponse = {
                id: userCreatePrisma.id,
                name: userCreatePrisma.name,
                email: userCreatePrisma.email,
                createdAt: userCreatePrisma.createdAt,
                updatedAt: userCreatePrisma.updatedAt,
            };
            return newUser;
        } catch (error: any) {
            console.log(error);
            throw new AppError(error.message, error.statusCode);
        }
    }
}

