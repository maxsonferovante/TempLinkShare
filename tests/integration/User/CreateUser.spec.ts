/**
 * @jest-environment ./prisma/prisma-environment-jest
 */
import request from "supertest";
import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";

import { app } from "../../../src/app";

import { PrismaClient } from "@prisma/client";




describe("Criação de Usuário - Integração", () => {
    const prisma = new PrismaClient();
    test("Deve ser capaz de criar um novo usuário", async () => {
        const response = await request(app).post("/user/register").send({
            name: "User Example",
            email: "user@email.com",
            password: "123456dasdsad"
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");
    });

    test("Não deve ser capaz de criar um novo usuário com email já existente", async () => {
        await request(app).post("/user/register").send({
            name: "User Example",
            email: "existente@email.com",
            password: "123456dasdsad"
        });
        const response = await request(app).post("/user/register").send({
            name: "User Example",
            email: "existente@email.com",
            password: "123456dasdsad"
        });
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: expect.any(Number),

            })
        );
    });

    test("Não deve ser capaz de criar um novo usuário sem o campo 'name'", async () => {
        const response = await request(app).post("/user/register").send({
            name: "",
            email: "test@test.com",
            password: "12345677"
        });

        expect(response.statusCode).toBe(400);
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

    test("Não deve ser capaz de criar um novo usuário sem o campo 'email'", async () => {
        const response = await request(app).post("/user/register").send({
            name: "Test",
            email: "",
            password: "12345677"
        });

        expect(response.statusCode).toBe(400);
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

    test("Não deve ser capaz de criar um novo usuário sem o campo 'password'", async () => {
        const response = await request(app).post("/user/register").send({
            name: "Teste",
            email: "test@test.com",
            password: ""
        });

        expect(response.statusCode).toBe(400);
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