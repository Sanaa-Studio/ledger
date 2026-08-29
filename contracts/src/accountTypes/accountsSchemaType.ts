import { AccountTypeSchema } from "./accountType.js";
import * as z from "zod";

export const CreateAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(100, "Account name is too long"),
  type: AccountTypeSchema,
  openingBalance: z.number(),
});

export const UpdateAccountSchema = CreateAccountSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  },
);

export const AccountSchema = CreateAccountSchema.extend({
  id: z.number().int().positive(),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
export type Account = z.infer<typeof AccountSchema>;
