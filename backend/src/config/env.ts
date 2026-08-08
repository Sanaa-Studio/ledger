import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT ?? 5001),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
};

export default env;
