/**
 * @jest-environment ./prisma/prisma-environment-jest
 */
import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

import { PrismaClient } from "@prisma/client";

import { app } from "../../../src/app";

import { CryptoPassword } from '../../../src/utils/cryptoPassword'
import { sign } from "jsonwebtoken";
import { UserCreate } from "../../../src/entities/User";



const userCreateTests: UserCreate = {
    name: "Testes",
    email: "teste@teste.com",
    password: "1234567890",
}
let token: string;

describe("Upload de Arquivos - Integração", () => {
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
        token = sign({ id: userCreate.id }, process.env.SECRECT_TOKEN || '', { expiresIn: process.env.EXPIRES_IN_TOKEN });
    });
    afterAll(async () => {

        await prisma.$disconnect();
    });

    test("Deve ser capaz de fazer upload de um arquivo", async () => {
        const responseUpload = await request(app).post("/file/upload").set('Authorization', `Bearer ${token}`)
            .attach('file', './tests/integration/File/exemple.zip');
        expect(responseUpload.status).toBe(201);
        expect(responseUpload.body).toEqual(
            expect.objectContaining({
                experationData: expect.any(String),
                responseUploaded: expect.objectContaining({
                    path: expect.any(String),
                    url: expect.any(String),
                })
            })
        );

    });
});