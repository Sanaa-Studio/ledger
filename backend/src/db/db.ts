import env from "../config/env.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const getPool = (): Pool => {
    switch (env.appEnv){
        case "development": {
            return new Pool({
                connectionString: env.databaseUrl
            });
        };

        case "test": {
            return new Pool({
                connectionString: env.databaseUrl
            });
        };

        case "beta": {
            return new Pool({
                connectionString: env.databaseUrl,
                ssl: {
                    rejectUnauthorized: true,
                    ca: env.databaseCaCertificate
                },
            });
        };

        case "production": {
            return new Pool({
                connectionString: env.databaseUrl,
                ssl: {
                    rejectUnauthorized: true,
                    ca: env.databaseCaCertificate
                },
            });
        };
    };
};

export const pool = getPool();
export const db = drizzle({ client: pool });
