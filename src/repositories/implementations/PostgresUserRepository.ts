import { IAUserRepository } from "../IAUserRepository";
import { User, UserModel, UserCreate, userCreatedResponse } from "../../entities/User";

import { PrismaClient } from "@prisma/client";
import { AppError } from "../../erros/AppError";

const prisma = new PrismaClient();

export class PostgresUserRepository implements IAUserRepository {
    findById(id: string): Promise<User | null> {
        try {
            const userExist = prisma.user.findFirst({
                where: {
                    id: id,
                },
            });
            if (userExist === null) {
                console.log("User not already exists"); ''
                throw new AppError("User not already exists", 404);
            }
            return userExist;
        } catch (error: any) {
            throw new AppError(error.message, error.statusCode);
        }
    }
    async findByEmail(email: string): Promise<User | null> {
        try {
            const userExist = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (userExist !== null) {
                console.log("User already exists"); ''
                throw new AppError("User already exists", 409);
            }
            return userExist;
        } catch (error: any) {
            throw new AppError(error.message, error.statusCode);
        }
    }
    async getByEmail(email: string): Promise<User | null> {

        try {
            const userExist = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (userExist === null) {
                console.log("User not already exists"); ''
                throw new AppError("User not already exists", 409);
            }
            return userExist;
        } catch (error: any) {
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

