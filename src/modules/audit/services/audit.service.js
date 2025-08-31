// src/modules/audit/services/audit.services.js
import api from "@/services/axios";

export const getAuditLogs = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/audit${queryString ? `?${queryString}` : ''}`);
};