import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getTransactions = asyncHandler(async (req, res) => {
  // gets all user txns
});

const getTransactionById = asyncHandler(async (req, res) => {
  // gets user txn info based on particular id

});

const createTransaction = asyncHandler(async (req, res) => {
  // gets txn info from frontend and creates a new txn
});

const updateTransaction = asyncHandler(async (req, res) => {
  // gets txn info from frontend and updates the existing txn
});

const deleteTransaction = asyncHandler(async (req, res) => {
  // gets txn id from frontend and deletes the txn
});

export {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
