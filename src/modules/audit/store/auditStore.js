
// src/modules/audit/store/auditStore.js
import { defineStore } from 'pinia';
import { getAuditLogs } from '../services/audit.service';

export const useAuditStore = defineStore('audit', {
  state: () => ({
    auditLogs: [],
    userAuditLogs: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      keywords: '',
      action: '',
      sortField: 'timestamp',
      sortType: 'desc',
      startDate: '',
      endDate: '',
      userId: '' // Add userId to filters
    }
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getPaginatedLogs: (state) => state.auditLogs,
    getTotalElements: (state) => state.pagination.total,
    getFilters: (state) => state.filters
  },

  actions: {
    async fetchAuditLogs(params = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        // Merge default params with provided params
        const queryParams = {
          start: (params.page - 1) * (params.limit || this.pagination.pageSize) || 0,
          limit: params.limit || this.pagination.pageSize,
          keywords: params.keywords || this.filters.keywords,
          action: params.action || this.filters.action,
          sortField: params.sortField || this.filters.sortField,
          sortType: params.sortType || this.filters.sortType,
          startDate: params.startDate || this.filters.startDate,
          endDate: params.endDate || this.filters.endDate,
          userId: params.userId || this.filters.userId // Add userId param
        };

        // Remove empty params
        const cleanParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );

        const response = await getAuditLogs(cleanParams);
        const data = response.data;
        
        this.auditLogs = data.content;
        this.pagination = {
          current: data.number + 1,
          pageSize: data.size,
          total: data.totalElements,
          totalPages: data.totalPages
        };

        // Update filters state
        this.filters = {
          ...this.filters,
          ...params
        };
        
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to fetch audit logs';
        console.error('Error fetching audit logs:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserAuditLogs(userId, params = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        const queryParams = {
          start: (params.page - 1) * (params.limit || 10) || 0,
          limit: params.limit || 10,
          keywords: params.keywords || '',
          action: params.action || '',
          sortField: params.sortField || 'timestamp',
          sortType: params.sortType || 'desc',
          startDate: params.startDate || '',
          endDate: params.endDate || '',
          userId: userId // Use userId param in getAuditLogs
        };

        const cleanParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );

        const response = await getAuditLogs(cleanParams); // Use the same API
        const data = response.data;
        
        this.userAuditLogs = data.content || data;
        
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to fetch user audit logs';
        console.error('Error fetching user audit logs:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
    },

    resetFilters() {
      this.filters = {
        keywords: '',
        action: '',
        sortField: 'timestamp',
        sortType: 'desc',
        startDate: '',
        endDate: '',
        userId: ''
      };
    },

    clearError() {
      this.error = null;
    },

    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },

    getActionColor(action) {
      const colors = {
        'CREATE': '#10b981', // green-500
        'UPDATE': '#f59e0b', // amber-500
        'DELETE': '#ef4444', // red-500
        'READ': '#3b82f6',   // blue-500
        'VIEW': '#3b82f6',   // blue-500
        'LOGIN': '#8b5cf6',  // violet-500
        'LOGOUT': '#f97316', // orange-500
        'EXPORT': '#06b6d4', // cyan-500
        'IMPORT': '#84cc16'  // lime-500
      };
      return colors[action] || '#6b7280'; // gray-500
    },

    getActionIcon(action) {
      const icons = {
        'CREATE': 'Plus',
        'UPDATE': 'Edit',
        'DELETE': 'Delete',
        'READ': 'View',
        'VIEW': 'View',
        'LOGIN': 'User',
        'LOGOUT': 'SwitchButton',
        'EXPORT': 'Download',
        'IMPORT': 'Upload'
      };
      return icons[action] || 'Document';
    },

    formatJsonString(jsonString) {
      if (!jsonString) return null;
      try {
        const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        return JSON.stringify(parsed, null, 2);
      } catch (error) {
        return jsonString;
      }
    },

    // Get unique values for filter options
    getUniqueActions() {
      const actions = this.auditLogs.map(log => log.action);
      return [...new Set(actions)];
    },

    getUniqueEntityNames() {
      const entities = this.auditLogs.map(log => log.entityName);
      return [...new Set(entities)];
    }
  }
});