import { Router } from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(verifyJWT);

router
  .route("/")
  .get(verifyJWT, getTransactions)
  .post(verifyJWT, createTransaction)
  .delete(verifyJWT, deleteAllTransactions);

router
  .route("/:id")
  .get(verifyJWT, getTransactionById)
  .patch(verifyJWT, updateTransaction)
  .delete(verifyJWT, deleteTransaction);

export default router;
