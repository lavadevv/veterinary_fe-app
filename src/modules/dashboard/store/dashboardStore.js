import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as dashboardService from '../services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const loading = ref(false)
  const overview = ref({})
  const recentActivities = ref([])
  const materialCategories = ref([])
  const monthlyTransactions = ref({})
  const warehouseUtilization = ref([])
  const stockAlerts = ref([])
  const performanceMetrics = ref({})
  const topMaterials = ref([])
  const lastUpdated = ref(null)

  // Getters
  const criticalAlerts = computed(() => 
    stockAlerts.value.filter(alert => alert.alertLevel === 'critical')
  )
  
  const warningAlerts = computed(() => 
    stockAlerts.value.filter(alert => alert.alertLevel === 'warning')
  )

  const totalAlertsCount = computed(() => stockAlerts.value.length)
  
  const criticalAlertsCount = computed(() => criticalAlerts.value.length)

  const averageWarehouseUtilization = computed(() => {
    if (!warehouseUtilization.value.length) return 0
    const total = warehouseUtilization.value.reduce((sum, wh) => sum + wh.utilization, 0)
    return Math.round(total / warehouseUtilization.value.length)
  })

  const totalMaterialValue = computed(() => {
    return topMaterials.value.reduce((sum, material) => sum + material.value, 0)
  })

  const isDataStale = computed(() => {
    if (!lastUpdated.value) return true
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return new Date(lastUpdated.value) < fiveMinutesAgo
  })

  // Actions
  const fetchDashboardOverview = async () => {
    try {
      loading.value = true
      const response = await dashboardService.getDashboardOverview()
      
      if (response.data.success) {
        overview.value = response.data.data
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tổng quan:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const response = await dashboardService.getRecentActivities()
      
      if (response.data.success) {
        recentActivities.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error)
    }
  }

  const fetchMaterialCategories = async () => {
    try {
      const response = await dashboardService.getMaterialCategoriesData()
      
      if (response.data.success) {
        materialCategories.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching material categories:', error)
    }
  }

  const fetchMonthlyTransactions = async () => {
    try {
      const response = await dashboardService.getMonthlyTransactions()
      
      if (response.data.success) {
        monthlyTransactions.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching monthly transactions:', error)
    }
  }

  const fetchWarehouseUtilization = async () => {
    try {
      const response = await dashboardService.getWarehouseUtilization()
      
      if (response.data.success) {
        warehouseUtilization.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching warehouse utilization:', error)
    }
  }

  const fetchStockAlerts = async () => {
    try {
      const response = await dashboardService.getStockAlerts()
      
      if (response.data.success) {
        stockAlerts.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching stock alerts:', error)
    }
  }

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await dashboardService.getPerformanceMetrics()
      
      if (response.data.success) {
        performanceMetrics.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching performance metrics:', error)
    }
  }

  const fetchTopMaterials = async () => {
    try {
      const response = await dashboardService.getTopMaterials()
      
      if (response.data.success) {
        topMaterials.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching top materials:', error)
    }
  }

  const fetchAllDashboardData = async () => {
    try {
      loading.value = true
      
      await Promise.all([
        fetchDashboardOverview(),
        fetchRecentActivities(),
        fetchMaterialCategories(),
        fetchMonthlyTransactions(),
        fetchWarehouseUtilization(),
        fetchStockAlerts(),
        fetchPerformanceMetrics(),
        fetchTopMaterials()
      ])
      
      lastUpdated.value = new Date().toISOString()
      
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error)
    } finally {
      loading.value = false
    }
  }

  const refreshData = async () => {
    await fetchAllDashboardData()
    console.log('Dữ liệu đã được cập nhật')
  }

  const clearData = () => {
    overview.value = {}
    recentActivities.value = []
    materialCategories.value = []
    monthlyTransactions.value = {}
    warehouseUtilization.value = []
    stockAlerts.value = []
    performanceMetrics.value = {}
    topMaterials.value = []
    lastUpdated.value = null
  }

  return {
    // State
    loading,
    overview,
    recentActivities,
    materialCategories,
    monthlyTransactions,
    warehouseUtilization,
    stockAlerts,
    performanceMetrics,
    topMaterials,
    lastUpdated,
    
    // Getters
    criticalAlerts,
    warningAlerts,
    totalAlertsCount,
    criticalAlertsCount,
    averageWarehouseUtilization,
    totalMaterialValue,
    isDataStale,
    
    // Actions
    fetchDashboardOverview,
    fetchRecentActivities,
    fetchMaterialCategories,
    fetchMonthlyTransactions,
    fetchWarehouseUtilization,
    fetchStockAlerts,
    fetchPerformanceMetrics,
    fetchTopMaterials,
    fetchAllDashboardData,
    refreshData,
    clearData
  }
})
