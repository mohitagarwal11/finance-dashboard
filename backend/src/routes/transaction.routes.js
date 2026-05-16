import { Router } from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/").get(getTransactions).post(createTransaction);

router
  .route("/:id")
  .get(getTransactionById)
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default router;
