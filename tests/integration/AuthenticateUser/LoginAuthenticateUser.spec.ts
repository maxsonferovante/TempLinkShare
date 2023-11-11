/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { PrismaClient } from "@prisma/client";

import { app } from "../../../src/app";
import { UserCreate } from "../../../src/entities/User";
import { CryptoPassword } from '../../../src/ultis/cryptoPassword'





const userCreateTests: UserCreate = {
    name: "Testes",
    email: "testes@testes.com",
    password: "1234567890",
}

describe("Autenticação de Usuário - Integração", () => {
    const prisma = new PrismaClient();

    beforeAll(async () => {

        const passwordHash = CryptoPassword.getInstance().hashPassword(userCreateTests.password);
        const userCreate = await prisma.user.create({

            data: {
                name: userCreateTests.name,
                email: userCreateTests.email,
                password: passwordHash,
            }
        });
    });

    test("Deve ser capaz de autenticar um usuário", async () => {

        const response = await request(app).post("/authenticate/login").send({
            email: userCreateTests.email,
            password: userCreateTests.password,
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
                user: expect.objectContaining({
                    email: expect.any(String), id: expect.any(String)
                })
            })
        );
    });

    test("Não deve ser capaz de autenticar um usuário com senha incorreta", async () => {
        const response = await request(app).post("/authenticate/login").send({
            email: userCreateTests.email,
            password: "Senha incorreta",
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: expect.any(Number),
            })
        );
    });

    test("Não deve ser capaz de autenticar um usuário com o email incorreto", async () => {
        const response = await request(app).post("/authenticate/login").send({
            email: "emailIncorreto@teste.com",
            password: userCreateTests.password,
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: expect.any(Number),
            })
        );
    });

    test("Não deve ser capaz de autenticar com o corpo da requição vazia", async () => {
        const response = await request(app).post("/authenticate/login").send({
            email: "",
            password: "",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.arrayContaining([
                    expect.objectContaining({
                        message: expect.any(String),
                        path: expect.any(String),
                    })
                ])
            })
        );
    });

    test("Não deve ser capaz de autenticar sem informar o campo 'email'", async () => {
        const response = await request(app).post("/authenticate/login").send({
            email: "",
            password: userCreateTests.password,
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.arrayContaining([
                    expect.objectContaining({
                        message: expect.any(String),
                        path: expect.any(String),
                    })
                ])
            })
        );
    });

    test("Não deve ser capaz de autenticar sem informar o campo 'password'", async () => {
        const response = await request(app).post("/authenticate/login").send({
            email: userCreateTests.email,
            password: "",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.arrayContaining([
                    expect.objectContaining({
                        message: expect.any(String),
                        path: expect.any(String),
                    })
                ])
            })
        );
    });
});