<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <i class="fas fa-tachometer-alt mr-3"></i>
            Dashboard
          </h1>
          <p class="page-subtitle">
            Tổng quan hệ thống quản lý kho thú y
          </p>
        </div>
        
        <div class="header-actions">
          <div class="last-updated" v-if="dashboardStore.lastUpdated">
            <i class="fas fa-clock mr-2"></i>
            <span>Cập nhật: {{ formatLastUpdated }}</span>
            <el-badge 
              v-if="dashboardStore.isDataStale" 
              is-dot 
              class="ml-2"
              type="warning"
            >
            </el-badge>
          </div>
          
          <el-button 
            type="primary" 
            :loading="dashboardStore.loading"
            @click="refreshDashboard"
            size="large"
          >
            <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': dashboardStore.loading }"></i>
            Làm mới
          </el-button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <!-- Overview Cards -->
      <OverviewCards 
        :overview="dashboardStore.overview"
        :loading="dashboardStore.loading"
      />

      <!-- Main Grid -->
      <div class="dashboard-grid">
        <!-- Left Column -->
        <div class="grid-column left-column">
          <!-- Material Categories Chart -->
          <MaterialCategoriesChart 
            :categories="dashboardStore.materialCategories"
            :loading="dashboardStore.loading"
          />

          <!-- Monthly Transactions Chart -->
          <MonthlyTransactionsChart 
            :chart-data="dashboardStore.monthlyTransactions"
            :loading="dashboardStore.loading"
          />

          <!-- Performance Metrics -->
          <PerformanceMetrics 
            :metrics="dashboardStore.performanceMetrics"
            :loading="dashboardStore.loading"
          />
        </div>

        <!-- Right Column -->
        <div class="grid-column right-column">
          <!-- Stock Alerts -->
          <StockAlerts 
            :alerts="dashboardStore.stockAlerts"
            :loading="dashboardStore.loading"
            @restock="handleRestock"
            @view-details="handleViewStockDetails"
            @view-all="handleViewAllAlerts"
          />

          <!-- Recent Activities -->
          <RecentActivities 
            :activities="dashboardStore.recentActivities"
            :loading="dashboardStore.loading"
            @refresh="refreshActivities"
            @view-all="handleViewAllActivities"
          />

          <!-- Top Materials -->
          <TopMaterials 
            :materials="dashboardStore.topMaterials"
            :loading="dashboardStore.loading"
            @view-material="handleViewMaterial"
            @manage-material="handleManageMaterial"
            @view-all="handleViewAllMaterials"
            @period-change="handleMaterialPeriodChange"
          />
        </div>
      </div>
    </div>

    <!-- Quick Actions Floating Button -->
    <el-backtop target=".dashboard-page" :right="30" :bottom="80">
      <div class="backtop-content">
        <i class="fas fa-arrow-up"></i>
      </div>
    </el-backtop>

    <!-- Quick Actions Menu -->
    <div class="quick-actions">
      <el-dropdown trigger="click" placement="top">
        <el-button type="primary" size="large" circle class="quick-action-btn">
          <i class="fas fa-plus"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="createNewMaterial">
              <i class="fas fa-box mr-2"></i>
              Thêm vật liệu mới
            </el-dropdown-item>
            <el-dropdown-item @click="createNewLocation">
              <i class="fas fa-map-marker-alt mr-2"></i>
              Tạo vị trí mới
            </el-dropdown-item>
            <el-dropdown-item @click="createNewTransaction">
              <i class="fas fa-exchange-alt mr-2"></i>
              Tạo giao dịch mới
            </el-dropdown-item>
            <el-dropdown-item @click="viewReports">
              <i class="fas fa-chart-bar mr-2"></i>
              Xem báo cáo
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../store/dashboardStore'
import { ElMessage, ElNotification } from 'element-plus'

// Components
import OverviewCards from '../components/OverviewCards.vue'
import MaterialCategoriesChart from '../components/MaterialCategoriesChart.vue'
import MonthlyTransactionsChart from '../components/MonthlyTransactionsChart.vue'
import PerformanceMetrics from '../components/PerformanceMetrics.vue'
import StockAlerts from '../components/StockAlerts.vue'
import RecentActivities from '../components/RecentActivities.vue'
import TopMaterials from '../components/TopMaterials.vue'

// Composables
const dashboardStore = useDashboardStore()
const router = useRouter()

// Auto refresh interval
let refreshInterval = null

// Computed
const formatLastUpdated = computed(() => {
  if (!dashboardStore.lastUpdated) return ''
  
  const date = new Date(dashboardStore.lastUpdated)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Vừa xong'
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
  
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  })
})

// Methods
const refreshDashboard = async () => {
  try {
    await dashboardStore.refreshData()
  } catch (error) {
    ElMessage.error('Lỗi khi làm mới dashboard')
  }
}

const refreshActivities = async () => {
  try {
    await dashboardStore.fetchRecentActivities()
    ElMessage.success('Đã cập nhật hoạt động gần đây')
  } catch (error) {
    ElMessage.error('Lỗi khi cập nhật hoạt động')
  }
}

const handleRestock = (alert) => {
  ElNotification({
    title: 'Nhập thêm vật liệu',
    message: `Chuẩn bị nhập thêm: ${alert.materialName}`,
    type: 'info',
    duration: 3000
  })
  
  // TODO: Navigate to restock page or open dialog
  console.log('Restock material:', alert)
}

const handleViewStockDetails = (alert) => {
  // TODO: Navigate to material details page
  console.log('View stock details:', alert)
}

const handleViewAllAlerts = () => {
  // TODO: Navigate to alerts page
  router.push('/materials/alerts')
}

const handleViewAllActivities = () => {
  // TODO: Navigate to activities/audit page
  router.push('/audit')
}

const handleViewMaterial = (material) => {
  // TODO: Navigate to material details page
  console.log('View material:', material)
}

const handleManageMaterial = (material) => {
  // TODO: Navigate to material management page
  console.log('Manage material:', material)
}

const handleViewAllMaterials = () => {
  router.push('/materials/materials')
}

const handleMaterialPeriodChange = (period) => {
  ElMessage.info(`Đổi khoảng thời gian: ${period}`)
  // TODO: Refetch data with new period
}

// Quick Actions
const createNewMaterial = () => {
  router.push('/materials/materials?action=create')
}

const createNewLocation = () => {
  router.push('/materials/locations?action=create')
}

const createNewTransaction = () => {
  router.push('/materials/transactions?action=create')
}

const viewReports = () => {
  ElMessage.info('Tính năng báo cáo đang phát triển')
}

// Lifecycle
onMounted(async () => {
  // Load dashboard data
  await dashboardStore.fetchAllDashboardData()
  
  // Setup auto refresh every 5 minutes
  refreshInterval = setInterval(() => {
    if (!dashboardStore.loading) {
      dashboardStore.fetchAllDashboardData()
    }
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.dashboard-header {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.page-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.last-updated {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
  background: #f9fafb;
  padding: 8px 12px;
  border-radius: 8px;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.quick-actions {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
}

.quick-action-btn {
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  transform: scale(1.1);
}

.backtop-content {
  height: 40px;
  width: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .right-column {
    order: -1;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .page-title {
    font-size: 24px;
    justify-content: center;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .last-updated {
    order: 1;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .dashboard-page {
    padding: 12px;
  }
  
  .dashboard-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 8px;
  }
}

/* Loading States */
.dashboard-content :deep(.el-loading-mask) {
  border-radius: 12px;
}

/* Custom Scrollbar */
.dashboard-page :deep(*::-webkit-scrollbar) {
  width: 6px;
}

.dashboard-page :deep(*::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.dashboard-page :deep(*::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

.dashboard-page :deep(*::-webkit-scrollbar-thumb:hover) {
  background: #a1a1a1;
}

/* Animation for cards */
.dashboard-grid > * {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for grid items */
.grid-column > *:nth-child(1) { animation-delay: 0.1s; }
.grid-column > *:nth-child(2) { animation-delay: 0.2s; }
.grid-column > *:nth-child(3) { animation-delay: 0.3s; }
.grid-column > *:nth-child(4) { animation-delay: 0.4s; }
</style>
