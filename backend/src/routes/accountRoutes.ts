import express from 'express';
import * as accountController from '../controller/accountController.js';

const router = express.Router();

router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccountById);
router.post('/', accountController.postAccount);
router.put('/:id', accountController.putAccount);
router.patch('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

export default router
