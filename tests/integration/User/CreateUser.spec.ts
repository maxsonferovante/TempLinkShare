import { app } from "../../../src/app";

import { describe, test, expect, beforeAll } from "@jest/globals";
import request from "supertest";

import { PrismaClient } from "@prisma/client";

describe("Create User", () => {
    beforeAll(async () => {
        const prisma = new PrismaClient();
        await prisma.user.deleteMany();
    });

    test("Should be able to create a new user", async () => {
        const response = await request(app).post("/user/register").send({
            name: "User Example",
            email: "user@email.com",
            password: "123456dasdsad"
        });
        console.log(response.body);
        expect(response.statusCode).toBe(201);
    });

});