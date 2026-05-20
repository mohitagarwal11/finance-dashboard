import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../api/transactions.js";
import { useAuth } from "../hooks/useAuth.js";
import { TransactionsContext } from "./transactionsContext.js";

export function TransactionsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  const fetchTransactions = useCallback(async (signal) => {
    setStatus("loading");
    setError(null);
    const requestId = ++requestIdRef.current;

    const response = await getTransactions({ signal });
    if (requestId !== requestIdRef.current) return null;

    const nextTransactions = response.data?.data || [];
    setTransactions(nextTransactions);
    setStatus("ready");

    return nextTransactions;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setTransactions([]);
      setStatus("idle");
      setError(null);
      return;
    }

    const controller = new AbortController();

    fetchTransactions(controller.signal).catch((fetchError) => {
      if (
        fetchError?.name === "CanceledError" ||
        fetchError?.code === "ERR_CANCELED"
      ) {
        return;
      }

      setStatus("error");
      setError(fetchError);
    });

    return () => controller.abort();
  }, [fetchTransactions, isAuthenticated]);

  const refresh = useCallback(async () => {
    const controller = new AbortController();
    try {
      await fetchTransactions(controller.signal);
    } finally {
      controller.abort();
    }
  }, [fetchTransactions]);

  const addTransaction = useCallback(
    async (transactionData) => {
      await createTransaction(transactionData);
      await refresh();
    },
    [refresh],
  );

  const editTransaction = useCallback(
    async (transactionId, transactionData) => {
      await updateTransaction(transactionId, transactionData);
      await refresh();
    },
    [refresh],
  );

  const removeTransaction = useCallback(
    async (transactionId) => {
      await deleteTransaction(transactionId);
      await refresh();
    },
    [refresh],
  );

  const clearTransactions = useCallback(() => {
    setTransactions([]);
    setStatus("idle");
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      status,
      error,
      isLoading: status === "loading",
      refresh,
      addTransaction,
      editTransaction,
      removeTransaction,
      setTransactions,
      clearTransactions,
    }),
    [
      addTransaction,
      clearTransactions,
      editTransaction,
      error,
      refresh,
      removeTransaction,
      status,
      transactions,
    ],
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}
