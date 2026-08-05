export const AccountType = {
    Checking: "checking",
    Savings: "savings",
    CreditCard: "creditCard",
    Cash: "cash",
    Investment: "investment"
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export type Account = {
    id: number,
    type: AccountType,
    balance: number,
}
