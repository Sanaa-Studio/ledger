import express from "express";
import {
  getAccounts,
  getAccountById,
  postAccount,
  putAccount,
  updateAccount,
  deleteAccount,
} from "../controller/accountController.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();

router.param("id", validateId);

router.get("/", getAccounts);
router.get("/:id", getAccountById);
router.post("/", postAccount);
router.put("/:id", putAccount);
router.patch("/:id", updateAccount);
router.delete("/:id", deleteAccount);

export default router;
