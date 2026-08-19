import dotenv from "dotenv";
import z from "zod";

const appEnv = z
    .enum(["development", "beta", "production"])
    .parse(process.env.APP_ENV ?? "development");

dotenv.config({ path: `.env.${appEnv}` });

const envSchema = z.object({
    PORT: z.coerce.number().default(5001),
    FRONTEND_URL: z.string().url().default("http://localhost:3000"),
});

const parsedEnv = envSchema.parse(process.env);

const env = {
  appEnv,
  port: parsedEnv.PORT,
  frontendUrl: parsedEnv.FRONTEND_URL,
};

export default env;
