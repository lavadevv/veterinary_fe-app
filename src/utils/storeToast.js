/**
 * Toast Helper for Pinia Stores
 * 
 * This helper ensures consistent toast usage across all stores.
 * Always import and use this helper instead of calling useToast() directly in stores.
 * 
 * Usage in Pinia Store:
 * ```javascript
 * import { createStoreToast } from '@/utils/storeToast'
 * 
 * export const useMyStore = defineStore('myStore', () => {
 *   const toast = createStoreToast()
 *   
 *   const myAction = async () => {
 *     try {
 *       // ... some action
 *       toast.success('Action completed successfully')
 *     } catch (error) {
 *       toast.error('Action failed: ' + error.message)
 *     }
 *   }
 * })
 * ```
 */

import { useToast } from '@/config/toast'

export const createStoreToast = () => {
  // Destructure once to avoid creating new instances
  const { showSuccess, showError, showInfo, showWarning } = useToast()
  
  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning
  }
}

/**
 * Type definitions for better IDE support
 * @typedef {Object} StoreToast
 * @property {function(string, number?): number} success - Show success toast
 * @property {function(string, number?): number} error - Show error toast  
 * @property {function(string, number?): number} info - Show info toast
 * @property {function(string, number?): number} warning - Show warning toast
 */
