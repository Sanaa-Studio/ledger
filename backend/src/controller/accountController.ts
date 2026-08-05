import { fetchAccounts, fetchAccount } from "../services/accountService.js";
import { type Request, type Response } from 'express';

// GET
export const getAccounts = (req: Request, res: Response) => {
    console.log(req.path);
    res.json(fetchAccounts());
} 

export const getAccountsById = (req: Request, res: Response) => {
    const accountId = req.params.id;

    if (!accountId){
        return res.status(404).json({
            "error": "invalid request",
        });
    };

    const account = fetchAccount(String(accountId));

    if (!account){
        return res.status(404).end();
    }

    res.json(fetchAccount(String(accountId)));
}