import axios from "axios";
import {
  AccountResponseSchema,
  AccountsResponseSchema,
  CreateAccountSchema,
  CreateTransactionSchema,
  TransactionResponseSchema,
  TransactionsResponseSchema,
  UpdateAccountSchema,
  UpdateTransactionSchema,
  type Account,
  type AccountQuery,
  type CreateAccountInput,
  type CreateTransactionInput,
  type Transaction,
  type TransactionQuery,
  type UpdateAccountInput,
  type UpdateTransactionInput,
} from "@ledger/contracts";
import { env } from "../config/env";
import { API_MAX_PAGE_SIZE } from "../ui/config";

const http = axios.create({ timeout: 5000 });

export const getAccounts = async (query: AccountQuery) => {
  const response = await http.get(env.accountsUrl, { params: query });
  return AccountsResponseSchema.parse(response.data);
};

export const getAllAccounts = async () => {
  const first = await getAccounts({ page: 1, limit: API_MAX_PAGE_SIZE });
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.meta.pages - 1) }, (_, index) =>
      getAccounts({ page: index + 2, limit: API_MAX_PAGE_SIZE }),
    ),
  );
  return [...first.data, ...rest.flatMap((response) => response.data)];
};

export const getAccount = async (id: number): Promise<Account> => {
  const response = await http.get(`${env.accountsUrl}/${id}`);
  return AccountResponseSchema.parse(response.data).data;
};

export const createAccount = async (input: CreateAccountInput) => {
  const payload = CreateAccountSchema.parse(input);
  const response = await http.post(env.accountsUrl, payload);
  return AccountResponseSchema.parse(response.data).data;
};

export const updateAccount = async (id: number, input: UpdateAccountInput) => {
  const payload = UpdateAccountSchema.parse(input);
  const response = await http.patch(`${env.accountsUrl}/${id}`, payload);
  return AccountResponseSchema.parse(response.data).data;
};

export const deleteAccount = async (id: number) => {
  const response = await http.delete(`${env.accountsUrl}/${id}`);
  return AccountResponseSchema.parse(response.data).data;
};

export const getTransactions = async (query: TransactionQuery) => {
  const response = await http.get(env.transactionsUrl, { params: query });
  return TransactionsResponseSchema.parse(response.data);
};

export const getAllTransactions = async () => {
  const first = await getTransactions({ page: 1, limit: API_MAX_PAGE_SIZE });
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.meta.pages - 1) }, (_, index) =>
      getTransactions({ page: index + 2, limit: API_MAX_PAGE_SIZE }),
    ),
  );
  return [...first.data, ...rest.flatMap((response) => response.data)];
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await http.get(`${env.transactionsUrl}/${id}`);
  return TransactionResponseSchema.parse(response.data).data;
};

export const createTransaction = async (input: CreateTransactionInput) => {
  const payload = CreateTransactionSchema.parse(input);
  const response = await http.post(env.transactionsUrl, payload);
  return TransactionResponseSchema.parse(response.data).data;
};

export const updateTransaction = async (
  id: number,
  input: UpdateTransactionInput,
) => {
  const payload = UpdateTransactionSchema.parse(input);
  const response = await http.patch(`${env.transactionsUrl}/${id}`, payload);
  return TransactionResponseSchema.parse(response.data).data;
};

export const deleteTransaction = async (id: number) => {
  await http.delete(`${env.transactionsUrl}/${id}`);
};

export const pageQuery = (page: number, limit: number) => ({ page, limit });

export const defaultAccountQuery: AccountQuery = { page: 1, limit: 10 };
export const defaultTransactionQuery: TransactionQuery = {
  page: 1,
  limit: 10,
};
