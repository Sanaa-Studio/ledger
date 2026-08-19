import dotenv from "dotenv";
import z from "zod";
import type { Env } from "../types/envType.js";

const appEnvSchema = z.enum(["development", "beta", "production"]);

const localDatabaseSchema = z.object({
    DATABASE_URL: z.string().nonempty(),
});

const deploymentDatabaseSchema = localDatabaseSchema.extend({
    DATABASE_CA_CERTIFICATE: z.string().nonempty(),
});

const loadEnv = (): Env => {
    const appEnv = appEnvSchema.parse(process.env.APP_ENV ?? "development");

    dotenv.config({ path: `.env.${appEnv}` });

    switch (appEnv) {
        case "development": {
            const parsedEnv = localDatabaseSchema.parse(process.env);

            return {
                appEnv,
                databaseUrl: parsedEnv.DATABASE_URL
            };
        };

        case "beta": {
            const parsedEnv = deploymentDatabaseSchema.parse(process.env);

            return {
                appEnv,
                databaseUrl: parsedEnv.DATABASE_URL,
                databaseCaCertificate: parsedEnv.DATABASE_CA_CERTIFICATE.replace(/\\n/g, "\n")
            };

        };

        case "production": {
            const parsedEnv = deploymentDatabaseSchema.parse(process.env);

            return {
                appEnv,
                databaseUrl: parsedEnv.DATABASE_URL,
                databaseCaCertificate: parsedEnv.DATABASE_CA_CERTIFICATE.replace(/\\n/g, "\n")
            };
        };
    };
}

const env = loadEnv();

export default env;