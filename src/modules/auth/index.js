// src/modules/auth/index.js - Main auth module entry point
import { authRoutes } from './authRoutes'
import { setupAuthGuards } from './guards'
import { useAuthStore } from './store/auth'

export { authRoutes, setupAuthGuards, useAuthStore }

// Export composables and utilities
export { useAuth } from './composables/useAuth'
export { ROLES, ROLE_LABELS } from './constants/roles'
export * from './utils/validation'