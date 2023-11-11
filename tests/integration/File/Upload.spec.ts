import { app } from "../../../src/app";
import { UserCreate } from "../../../src/entities/User";
import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import request from "supertest";
import { CryptoPassword } from '../../../src/ultis/cryptoPassword'
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userCreateTests: UserCreate = {
    name: "Testes",
    email: "teste@teste.com",
    password: "1234567890",
}
let token: string;

describe("Upload de Arquivos - Integração", () => {
    beforeAll(async () => {
        await prisma.user.deleteMany();
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
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    test("Deve ser capaz de fazer upload de um arquivo", async () => {
        const responseUpload = await request(app).post("/file/upload").set('Authorization', `Bearer ${token}`)
            .attach('file', './tests/integration/File/exemple.zip');
        expect(responseUpload.status).toBe(201);
        expect(responseUpload.body).toHaveProperty('responseUploaded');
        expect(responseUpload.body).toHaveProperty('experationTime');
    });
});