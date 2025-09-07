/**
 * Material Batch Service
 * 
 * Service layer for managing material batch operations.
 * Provides comprehensive API functions for material batch CRUD operations,
 * filtering, searching, and specialized batch management features.
 * 
 * Features:
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Advanced filtering and pagination
 * - Batch quantity management
 * - Test and usage status management  
 * - Location movement tracking
 * - Expiry monitoring and alerts
 * - FIFO (First In, First Out) batch management
 * 
 * API Endpoints mapping to backend MaterialBatchController:
 * GET /material-batches - List with pagination and filters
 * GET /material-batches/{id} - Get by ID
 * GET /material-batches/batch-number/{batchNumber} - Get by batch number
 * GET /material-batches/internal-code/{internalCode} - Get by internal code
 * GET /material-batches/by-material/{materialId} - Get batches by material
 * GET /material-batches/by-location/{locationId} - Get batches by location
 * POST /material-batches - Create new batch
 * PUT /material-batches/{id} - Update batch
 * DELETE /material-batches/{id} - Delete single batch
 * DELETE /material-batches/batch - Delete multiple batches
 * PUT /material-batches/{id}/quantity - Update quantity
 * PUT /material-batches/{id}/test-status - Update test status
 * PUT /material-batches/{id}/usage-status - Update usage status
 * PUT /material-batches/{id}/move-location - Move to new location
 * GET /material-batches/expired - Get expired batches
 * GET /material-batches/near-expiry - Get near expiry batches
 * GET /material-batches/usable - Get usable batches
 * GET /material-batches/total-quantity/{materialId} - Get total quantity
 * GET /material-batches/oldest-usable/{materialId} - Get oldest usable batches (FIFO)
 */

import api from "@/services/axios";

// ============================================================================
// LIST & SEARCH OPERATIONS
// ============================================================================

/**
 * Get paginated list of material batches with advanced filtering
 * 
 * Supports comprehensive filtering options:
 * - keywords: Search in batchNumber, internalBatchCode, manufacturerBatchNumber, materialName
 * - materialId: Filter by specific material
 * - locationId: Filter by storage location
 * - testStatus: Filter by test/quality control status
 * - usageStatus: Filter by usage availability status
 * - receivedFromDate/receivedToDate: Filter by received date range
 * - expiryFromDate/expiryToDate: Filter by expiry date range
 * - minQuantity/maxQuantity: Filter by quantity range
 * - nearExpiry: Show batches expiring within 30 days
 * - expired: Show already expired batches
 * - sortField/sortType: Custom sorting options
 * 
 * @param {Object} params - Filter parameters
 * @param {number} params.start - Pagination start (0-based)
 * @param {number} params.limit - Page size limit
 * @param {string} params.keywords - Search keywords
 * @param {number} params.materialId - Material ID filter
 * @param {number} params.locationId - Location ID filter
 * @param {string} params.testStatus - Test status filter
 * @param {string} params.usageStatus - Usage status filter
 * @param {string} params.receivedFromDate - Received date from (YYYY-MM-DD)
 * @param {string} params.receivedToDate - Received date to (YYYY-MM-DD)
 * @param {string} params.expiryFromDate - Expiry date from (YYYY-MM-DD)
 * @param {string} params.expiryToDate - Expiry date to (YYYY-MM-DD)
 * @param {number} params.minQuantity - Minimum quantity filter
 * @param {number} params.maxQuantity - Maximum quantity filter
 * @param {boolean} params.nearExpiry - Filter near expiry batches
 * @param {boolean} params.expired - Filter expired batches
 * @param {string} params.sortField - Field to sort by
 * @param {string} params.sortType - Sort direction (asc/desc)
 * @returns {Promise} API response with paginated batch list
 */
export const getMaterialBatches = (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return api.get(`/material-batches${queryString ? `?${queryString}` : ''}`)
}

// Alias for backward compatibility
export const getBatches = getMaterialBatches;

// ============================================================================
// SINGLE BATCH RETRIEVAL
// ============================================================================

/**
 * Get material batch by ID
 * @param {number} id - Batch ID
 * @returns {Promise} API response with batch details
 */
export const getBatchById = (id) => {
  return api.get(`/material-batches/${id}`)
}

/**
 * Get material batch by batch number
 * @param {string} batchNumber - Unique batch number
 * @returns {Promise} API response with batch details
 */
export const getBatchByNumber = (batchNumber) => api.get(`/material-batches/batch-number/${batchNumber}`);

/**
 * Get material batch by internal batch code
 * @param {string} internalCode - Internal tracking code
 * @returns {Promise} API response with batch details
 */
export const getBatchByInternalCode = (internalCode) => api.get(`/material-batches/internal-code/${internalCode}`);

// ============================================================================
// BATCH FILTERING BY RELATIONSHIPS
// ============================================================================

/**
 * Get all batches for a specific material
 * @param {number} materialId - Material ID
 * @returns {Promise} API response with material's batch list
 */
export const getBatchByMaterial = (materialId) => api.get(`/material-batches/by-material/${materialId}`);

/**
 * Get all batches stored in a specific location
 * @param {number} locationId - Storage location ID
 * @returns {Promise} API response with location's batch list
 */
export const getBatchByLocation = (locationId) => api.get(`/material-batches/by-location/${locationId}`);

// ============================================================================
// SPECIALIZED BATCH QUERIES
// ============================================================================

/**
 * Get all expired material batches
 * Useful for inventory cleanup and disposal planning
 * @returns {Promise} API response with expired batch list
 */
export const getExpiredBatches = () => api.get("/material-batches/expired");

/**
 * Get batches nearing expiry (within 30 days)
 * Critical for proactive inventory management
 * @returns {Promise} API response with near-expiry batch list
 */
export const getNearExpiryBatches = () => api.get("/material-batches/near-expiry");

/**
 * Get all usable batches (passed quality control and available for use)
 * @returns {Promise} API response with usable batch list
 */
export const getUsableBatches = () => api.get("/material-batches/usable");

/**
 * Get oldest usable batches for a material (FIFO principle)
 * Essential for proper inventory rotation and waste reduction
 * @param {number} materialId - Material ID
 * @returns {Promise} API response with oldest usable batches
 */
export const getOldestUsableBatch = (materialId) => api.get(`/material-batches/oldest-usable/${materialId}`);

/**
 * Get total available quantity for a specific material
 * Aggregates quantities across all usable batches
 * @param {number} materialId - Material ID
 * @returns {Promise} API response with total quantity
 */
export const getTotalQuantity = (materialId) => api.get(`/material-batches/total-quantity/${materialId}`);

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Create new material batch
 * @param {Object} data - Batch creation data
 * @param {string} data.batchNumber - Unique batch identifier
 * @param {string} data.internalBatchCode - Internal tracking code
 * @param {string} data.manufacturerBatchNumber - Manufacturer's batch number
 * @param {number} data.materialId - Associated material ID
 * @param {number} data.locationId - Storage location ID
 * @param {number} data.receivedQuantity - Initial received quantity
 * @param {number} data.currentQuantity - Current available quantity
 * @param {string} data.receivedDate - Date received (YYYY-MM-DD)
 * @param {string} data.expiryDate - Expiry date (YYYY-MM-DD)
 * @param {string} data.testStatus - Initial test status
 * @param {string} data.usageStatus - Initial usage status
 * @returns {Promise} API response with created batch data
 */
export const createBatch = (data) => api.post("/material-batches", data);

/**
 * Update material batch information
 * @param {number} id - Batch ID
 * @param {Object} data - Updated batch data
 * @returns {Promise} API response with updated batch data
 */
export const updateBatch = (id, data) => api.put(`/material-batches/${id}`, data);

/**
 * Delete single material batch
 * @param {number} id - Batch ID to delete
 * @returns {Promise} API response confirmation
 */
export const deleteBatch = (id) => api.delete(`/material-batches/${id}`);

/**
 * Delete multiple material batches
 * @param {number[]} ids - Array of batch IDs to delete
 * @returns {Promise} API response with deleted batch list
 */
export const deleteMultipleBatches = (ids) => api.delete("/material-batches/batch", { data: ids });

// ============================================================================
// BATCH MANAGEMENT OPERATIONS
// ============================================================================

/**
 * Move batch to new storage location
 * @param {number} id - Batch ID
 * @param {Object} data - Location data
 * @param {number} data.newLocationId - New location ID (optional, null = remove from location)
 * @returns {Promise} API response with updated batch data
 */
export const moveBatchLocation = (id, data) => api.put(`/material-batches/${id}/move-location`, data);

/**
 * Update batch quantity (for consumption, adjustments, etc.)
 * @param {number} id - Batch ID
 * @param {Object} data - Quantity data
 * @param {number} data.quantity - New quantity value
 * @returns {Promise} API response confirmation
 */
export const updateBatchQuantity = (id, data) => api.put(`/material-batches/${id}/quantity`, data);

/**
 * Update batch test/quality control status
 * @param {number} id - Batch ID
 * @param {Object} data - Test status data
 * @param {string} data.testStatus - New test status
 * @returns {Promise} API response confirmation
 */
export const updateBatchTestStatus = (id, data) => api.put(`/material-batches/${id}/test-status`, data);

/**
 * Update batch usage availability status
 * @param {number} id - Batch ID
 * @param {Object} data - Usage status data
 * @param {string} data.usageStatus - New usage status
 * @returns {Promise} API response confirmation
 */
export const updateBatchUsageStatus = (id, data) => api.put(`/material-batches/${id}/usage-status`, data);
