import express from "express";
import {
    getTransactions,
    getTransaction,
    createTransaction,
    deleteTransaction,
    putTransaction,
    updateTransaction
} from "../controller/transactionController.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();
router.param("id", validateId);

router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.put("/:id", putTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
