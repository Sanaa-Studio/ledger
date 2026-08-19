import dotenv from "dotenv";
import z from "zod";
import type { Env } from "../types/envType/envType.js";

const appEnvSchema = z.enum(["production", "beta", "development"]);

const localBackendSchema = z.object({
    PORT: z.coerce.number().default(5001),
    FRONTEND_URL: z.string().nonempty(),
    DATABASE_URL: z.string().nonempty()
});

const productionBackendSchema = localBackendSchema.extend({
    DATABASE_CA_CERTIFICATE: z.string().nonempty()
});

const loadEnv = (): Env => {
    const appEnv = appEnvSchema.parse(process.env.APP_ENV ?? "development");
    dotenv.config({ path: `.env.${appEnv}` });

    switch (appEnv) {
        case "development": {
            const parsedEnv = localBackendSchema.parse(process.env);

            const env: Env = {
                appEnv: appEnv,
                port: parsedEnv.PORT,
                frontendUrl: parsedEnv.FRONTEND_URL,
                databaseUrl: parsedEnv.DATABASE_URL
            };

            return env;
        };

        case "beta": {
            const parsedEnv = productionBackendSchema.parse(process.env);

            const env: Env = {
                appEnv: appEnv,
                port: parsedEnv.PORT,
                frontendUrl: parsedEnv.FRONTEND_URL,
                databaseUrl: parsedEnv.DATABASE_URL,
                databaseCaCertificate: parsedEnv.DATABASE_CA_CERTIFICATE
            };

            return env;
        };

        case "production": {
            const parsedEnv = productionBackendSchema.parse(process.env);

            const env: Env = {
                appEnv: appEnv,
                port: parsedEnv.PORT,
                frontendUrl: parsedEnv.FRONTEND_URL,
                databaseUrl: parsedEnv.DATABASE_URL,
                databaseCaCertificate: parsedEnv.DATABASE_CA_CERTIFICATE
            };

            return env;
        };
    };
};

const env = loadEnv();

export default env;
