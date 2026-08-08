import express from "express";
import * as transactionController from "../controller/transactionController.js";

const router = express.Router();

router.get("/", transactionController.getTransactions);
router.get("/:id", transactionController.getTransaction);
router.post("/", transactionController.createTransaction);
router.delete("/:id", transactionController.deleteTransaction);

export default router;
