import api from "@/services/axios";

export const getTransactions = () => api.get("/material-transactions");
export const getTransactionById = (id) => api.get(`/material-transactions/${id}`);
export const getTransactionsByBatch = (batchId) => api.get(`/material-transactions/batch/${batchId}`);
export const getTransactionsByDateRange = (params) => api.get("/material-transactions/date-range", { params });
export const getTransactionsByType = (type) => api.get(`/material-transactions/type/${type}`);
export const getTransactionsByWarehouseAndDate = (warehouseId, params) =>
  api.get(`/material-transactions/warehouse/${warehouseId}/date-range`, { params });

export const createTransaction = (data) => api.post("/material-transactions", data);
export const updateTransaction = (id, data) => api.put(`/material-transactions/${id}`, data);
export const approveTransaction = (id, data) => api.put(`/material-transactions/${id}/approve`, data);
