import api from "@/services/axios";

export const getStockAlerts = () => api.get("/stock-alerts");
export const getStockAlertById = (id) => api.get(`/stock-alerts/${id}`);
export const getUnresolvedAlerts = () => api.get("/stock-alerts/unresolved");
export const getExpiredAlerts = () => api.get("/stock-alerts/expired");
export const getNearExpiryAlerts = () => api.get("/stock-alerts/near-expiry");
export const getLowStockAlerts = () => api.get("/stock-alerts/low-stock");
export const getNegativeStockAlerts = () => api.get("/stock-alerts/negative-stock");
export const getQuarantineAlerts = () => api.get("/stock-alerts/quarantine");
export const getAlertsByMaterial = (materialId) => api.get(`/stock-alerts/material/${materialId}`);
export const getAlertCount = () => api.get("/stock-alerts/count/unresolved");
export const getAlertCountByType = (alertType) => api.get(`/stock-alerts/count/unresolved/${alertType}`);
export const getAlertsByDateRange = (params) => api.get("/stock-alerts/date-range", { params });

export const createStockAlert = (data) => api.post("/stock-alerts", data);
export const updateStockAlert = (id, data) => api.put(`/stock-alerts/${id}`, data);
export const resolveStockAlert = (data) => api.post("/stock-alerts/resolve", data);
