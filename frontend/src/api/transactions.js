import { api } from "./client";

export function getTransactions(config = {}) {
  return api.get("/transactions", config);
}

export function getTransactionById(transactionId) {
  return api.get(`/transactions/${transactionId}`);
}

export function createTransaction(transactionData) {
  return api.post("/transactions", transactionData);
}

export function updateTransaction(transactionId, transactionData) {
  return api.patch(`/transactions/${transactionId}`, transactionData);
}

export function deleteTransaction(transactionId) {
  return api.delete(`/transactions/${transactionId}`);
}
