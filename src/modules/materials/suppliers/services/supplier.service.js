import api from "@/services/axios";

export const getSuppliers = () => api.get("/suppliers");
export const getSupplierById = (id) => api.get(`/suppliers/${id}`);
export const getSupplierByCode = (code) => api.get(`/suppliers/code/${code}`);
export const getSuppliersByCountry = (country) => api.get(`/suppliers/country/${country}`);
export const getActiveSuppliers = () => api.get("/suppliers/active");
export const getExpiredGmpSuppliers = () => api.get("/suppliers/gmp/expired");
export const getExpiringGmpSuppliers = (days) => api.get(`/suppliers/gmp/expiring/${days}`);

export const createSupplier = (data) => api.post("/suppliers", data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const bulkCreateSuppliers = (data) => api.post("/suppliers/bulk", data);
export const toggleSupplierStatus = (id) => api.put(`/suppliers/${id}/toggle-status`);
