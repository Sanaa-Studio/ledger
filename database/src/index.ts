import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "./config/env.js";

const getPool = (): Pool => {
  switch (env.appEnv) {
    case "beta": {
      return new Pool({
        connectionString: env.databaseUrl,
        ssl: {
          rejectUnauthorized: true,
          ca: env.databaseCaCertificate,
        },
      });
    }

    case "development": {
      return new Pool({ connectionString: env.databaseUrl });
    }

    case "test": {
      return new Pool({ connectionString: env.databaseUrl });
    }

    case "production": {
      return new Pool({
        connectionString: env.databaseUrl,
        ssl: {
          rejectUnauthorized: true,
          ca: env.databaseCaCertificate,
        },
      });
    }
  }
};

export const pool = getPool();

export const db = drizzle({ client: pool });
