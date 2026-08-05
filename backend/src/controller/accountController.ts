import { fetchAccounts, fetchAccount, createAccount } from "../services/accountService.js";
import { type Request, type Response } from 'express';
import { CreateAccountSchema } from "../types/account.js";

// GET
export const getAccounts = (req: Request, res: Response) => {
    console.log(req.path);
    res.json(fetchAccounts());
} 

export const getAccountById = (req: Request, res: Response) => {
    const accountId = req.params.id;
    const account = fetchAccount(String(accountId));
    
    if (!account){
        return res.status(404).end();
    }

    res.json(account);
}

// POST
export const postAccount = (req: Request, res: Response) => {
    const result = CreateAccountSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(
            {
              error: "invalid account data",
              details: result.error.issues,   
            }
        );
    }

    const account = createAccount(result.data);
    return res.status(201).json(account);
}