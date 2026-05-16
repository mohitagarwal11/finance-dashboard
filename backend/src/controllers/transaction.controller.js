import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.models.js";

// gets all user txns
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    user: req.user._id,
  }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, transactions, "Transactions fetched"));
});

// gets user txn info based on particular id
const getTransactionById = asyncHandler(async (req, res) => {
  const txn = await Transaction.findById(req.params.id);

  if (!txn) {
    throw new ApiError(404, "Transaction not found");
  }

  return res.status(200).json(new ApiResponse(200, txn, "Transaction fetched"));
});

// gets txn info from frontend and creates a new txn
const createTransaction = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date } = req.body;

  const newTxn = await Transaction.create({
    user: req.user._id,
    title,
    amount,
    type,
    category,
    date,
  });

  if (!newTxn) {
    throw new ApiError(404, "Transaction not found or creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newTxn, "Transaction created"));
});

// gets txn info from frontend and updates the existing txn
const updateTransaction = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date } = req.body;

  const txn = await Transaction.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      $set: {
        title,
        amount,
        type,
        category,
        date,
      },
    },
    {
      new: true,
    },
  );

  if (!txn) {
    throw new ApiError(404, "Transaction not found or update failed");
  }

  return res.status(200).json(new ApiResponse(200, txn, "Transaction updated"));
});

// gets txn id from frontend and deletes the txn
const deleteTransaction = asyncHandler(async (req, res) => {
  const txn = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!txn) {
    throw new ApiError(404, "Transaction not found or deletion failed");
  }

  return res.status(200).json(new ApiResponse(200, txn, "Transaction deleted"));
});

export {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
