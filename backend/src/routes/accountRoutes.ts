import express from 'express';
import * as accountController from '../controller/accountController.js';

const router = express.Router();

router.get('/accounts', accountController.getAccounts);
router.get('/accounts/:id', accountController.getAccountsById);

export default router;
