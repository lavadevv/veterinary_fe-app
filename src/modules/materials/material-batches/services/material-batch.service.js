import api from "@/services/axios";

export const getMaterialBatches = () => api.get("/material-batches");
export const getBatchById = (id) => api.get(`/material-batches/${id}`);
export const getBatchByNumber = (batchNumber) => api.get(`/material-batches/batch-number/${batchNumber}`);
export const getBatchByInternalCode = (internalCode) => api.get(`/material-batches/internal-code/${internalCode}`);
export const getBatchByMaterial = (materialId) => api.get(`/material-batches/by-material/${materialId}`);
export const getBatchByLocation = (locationId) => api.get(`/material-batches/by-location/${locationId}`);
export const getExpiredBatches = () => api.get("/material-batches/expired");
export const getNearExpiryBatches = () => api.get("/material-batches/near-expiry");
export const getUsableBatches = () => api.get("/material-batches/usable");
export const getOldestUsableBatch = (materialId) => api.get(`/material-batches/oldest-usable/${materialId}`);
export const getTotalQuantity = (materialId) => api.get(`/material-batches/total-quantity/${materialId}`);

export const createBatch = (data) => api.post("/material-batches", data);
export const updateBatch = (id, data) => api.put(`/material-batches/${id}`, data);
export const moveBatchLocation = (id, data) => api.put(`/material-batches/${id}/move-location`, data);
export const updateBatchQuantity = (id, data) => api.put(`/material-batches/${id}/quantity`, data);
export const updateBatchTestStatus = (id, data) => api.put(`/material-batches/${id}/test-status`, data);
export const updateBatchUsageStatus = (id, data) => api.put(`/material-batches/${id}/usage-status`, data);
