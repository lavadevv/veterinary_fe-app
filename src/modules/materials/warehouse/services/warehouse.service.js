import api from "@/services/axios";

export const getWarehouses = () => api.get("/warehouse");
export const getWarehouseById = (id) => api.get(`/warehouse/${id}`);
export const getWarehouseByCode = (code) => api.get(`/warehouse/code/${code}`);
export const getWarehouseByType = (type) => api.get(`/warehouse/type/${type}`);
export const getActiveWarehouses = () => api.get("/warehouse/active");

export const createWarehouse = (data) => api.post("/warehouse", data);
export const updateWarehouse = (id, data) => api.put(`/warehouse/${id}`, data);
export const toggleWarehouseStatus = (id) => api.put(`/warehouse/${id}/toggle-status`);
