import { defineConfig } from "drizzle-kit";
import env from "./src/config/env.js";

const getDbCredentials = () => {
  switch (env.appEnv) {
    case "development": {
      return {
        url: env.databaseUrl,
        ssl: false,
      };
    }

    case "beta": {
      return {
        url: env.databaseUrl,
        ssl: {
          rejectUnauthorized: true,
          ca: env.databaseCaCertificate,
        },
      };
    }

    case "production": {
      return {
        url: env.databaseUrl,
        ssl: {
          rejectUnauthorized: true,
          ca: env.databaseCaCertificate,
        },
      };
    }
  }
};

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: getDbCredentials(),
});
