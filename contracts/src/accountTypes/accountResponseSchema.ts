import * as z from "zod";
import { AccountSchema } from "./accountsSchemaType.js";

export const AccountResponseSchema = z.object({
    data: AccountSchema

});

export const AccountsResponseSchema = z.object({
    data: z.array(AccountSchema),
    meta: z.object({
        page: z
            .number()
            .int()
            .positive(),
        limit: z
            .number()
            .int()
            .positive(),
        total: z
            .number()
            .int()
            .nonnegative(),
        pages: z
            .number()
            .int()
            .nonnegative(),
    })
});