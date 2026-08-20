import type { Account } from "./accountsSchemaType.js";

export type AccountQueryResponseType = {
  page: number;
  limit: number;
  totalAccounts: number;
  pages: number;
  data: Account [];
};
