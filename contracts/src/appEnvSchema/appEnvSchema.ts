import * as z from "zod";

export const appEnvSchema = z.enum([
  "production",
  "beta",
  "development",
  "test",
]);
