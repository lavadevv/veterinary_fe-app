import { reactive, ref } from 'vue'

// Toast state
const toasts = ref([])
let toastId = 0

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Toast configuration
const TOAST_CONFIG = {
  duration: 5000, // 5 seconds
  position: 'top-right' // top-right, top-left, bottom-right, bottom-left
}

// Generate unique ID for each toast
const generateId = () => ++toastId

// Add new toast
export const addToast = (message, type = TOAST_TYPES.INFO, duration = TOAST_CONFIG.duration) => {
  const id = generateId()
  const toast = {
    id,
    message,
    type,
    duration,
    timestamp: Date.now()
  }

  toasts.value.push(toast)

  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

// Remove toast by ID
export const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Clear all toasts
export const clearToasts = () => {
  toasts.value = []
}

// Composable for using toast
export const useToast = () => {
  const showToast = (message, type = TOAST_TYPES.INFO, duration) => {
    return addToast(message, type, duration)
  }

  const showSuccess = (message, duration) => {
    return addToast(message, TOAST_TYPES.SUCCESS, duration)
  }

  const showError = (message, duration) => {
    return addToast(message, TOAST_TYPES.ERROR, duration)
  }

  const showWarning = (message, duration) => {
    return addToast(message, TOAST_TYPES.WARNING, duration)
  }

  const showInfo = (message, duration) => {
    return addToast(message, TOAST_TYPES.INFO, duration)
  }

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearToasts
  }
}

