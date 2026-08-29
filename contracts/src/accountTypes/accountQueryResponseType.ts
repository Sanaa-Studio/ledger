import type { Account } from "./accountsSchemaType.js";

export type AccountQueryResponseType = {
  data: Account[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};
