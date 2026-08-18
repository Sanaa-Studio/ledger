import type { Account } from "../../types/accountTypes/accountsSchemaType.js";
import type { Transaction } from "../../types/transactionTypes/transactionsSchemaType.js";

const getMaxId = (data: Account[] | Transaction[]) => {
  return data.length === 0 ? 0 : Math.max(...data.map((entry) => entry.id));
};

export default getMaxId;
