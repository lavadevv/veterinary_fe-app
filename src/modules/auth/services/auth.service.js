// src/modules/auth/services/auth.services.js - Complete auth services
import api from "@/services/axios"

export const login = (data) => api.post("/auth/login", data)

export const register = (data) => api.post("/auth/register", data)

export const verifyAccount = (data) => api.put("/auth/verify-account", data)

export const regenerateOtp = (data) => api.put("/auth/regenerate-otp", data)

export const forgotPassword = (data) => api.put("/auth/forgot-password", data)

export const getProfile = () => api.get("/auth/profile")

export const updateProfile = (data) => api.put("/auth/profile", data)