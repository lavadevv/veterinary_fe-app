import api from "@/services/axios";

export const getMaterials = () => api.get("/material");
export const getActiveMaterials = () => api.get("/material/active");
export const getMaterialById = (id) => api.get(`/material/${id}`);
export const getMaterialByCode = (code) => api.get(`/material/code/${code}`);
export const getMaterialsBySupplier = (supplierId) => api.get(`/material/supplier/${supplierId}`);
export const getLowStockMaterials = () => api.get("/material/low-stock");
export const getColdStorageMaterials = () => api.get("/material/cold-storage");

export const createMaterial = (data) => api.post("/material", data);
export const updateMaterial = (id, data) => api.put(`/material/${id}`, data);
export const toggleMaterialStatus = (id) => api.put(`/material/${id}/toggle-status`);
export const updateMaterialStock = (id, data) => api.put(`/material/${id}/update-stock`, data);
