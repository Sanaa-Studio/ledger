export type Transaction = {
    id: number,
    accountId: number
    destinationAccountId: number | null,
    amount: number
    description: string | null,
    date: string
}