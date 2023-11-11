const NodeEnvironment = require("jest-environment-node").TestEnvironment;
const { v4: uuid } = require("uuid");
const { execSync } = require("child_process");
const { resolve } = require("path");
const { Client } = require("pg");


require("dotenv").config({
    path: resolve(__dirname, "..", ".env.test"),
});

global.__prismaTestMigrationsRun = false;

class CustomEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
        this.schema = `code_schema_${uuid()}`;
        console.log("schemas", this.schema);
        this.connectionString = `${process.env.DATABASE_URL}${this.schema}`;
    }

    setup() {
        if (!global.__prismaTestMigrationsRun) {
            process.env.DATABASE_URL = this.connectionString;
            this.global.process.env.DATABASE_URL = this.connectionString;

            // Rodar as migrations
            console.log("Running migrations...");
            try {
                execSync(`npx prisma migrate dev --preview-feature --schema=./prisma/schema.prisma --name init --create-db --experimental`);
            }
            catch (e) {
                console.log(e);
            }
            global.__prismaTestMigrationsRun = true;
        }
    }

    async teardown() {
        const client = new Client({
            connectionString: this.connectionString,
        });

        await client.connect();
        await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
        await client.end();
    }
}

module.exports = CustomEnvironment;