<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon class="w-8 h-8 mr-3 text-emerald-600" />
            Dashboard
          </h1>
          <p class="text-gray-600 mt-1">
            Tổng quan hệ thống quản lý kho thú y
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <div v-if="dashboardStore.lastUpdated" class="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <ClockIcon class="w-4 h-4 mr-2" />
            <span>Cập nhật: {{ formatLastUpdated }}</span>
            <div v-if="dashboardStore.isDataStale" class="w-2 h-2 bg-yellow-400 rounded-full ml-2"></div>
          </div>
          
          <button
            @click="refreshDashboard"
            :disabled="dashboardStore.loading"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowPathIcon class="w-4 h-4 mr-2" :class="{ 'animate-spin': dashboardStore.loading }" />
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="max-w-7xl mx-auto">
      <!-- Overview Cards -->
      <OverviewCards 
        :overview="dashboardStore.overview"
        :loading="dashboardStore.loading"
      />

      <!-- Main Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        <!-- Left Column (2/3 width) -->
        <div class="xl:col-span-2 space-y-8">
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

        <!-- Right Column (1/3 width) -->
        <div class="space-y-8">
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

    <!-- Back to Top Button -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-24 right-6 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 z-40"
      >
        <ArrowUpIcon class="w-5 h-5 mx-auto" />
      </button>
    </Transition>

    <!-- Quick Actions Menu -->
    <div class="fixed bottom-6 right-6 z-50">
      <Menu as="div" class="relative">
        <MenuButton class="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 hover:scale-110">
          <PlusIcon class="w-6 h-6 mx-auto" />
        </MenuButton>
        
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems class="absolute bottom-16 right-0 w-56 origin-bottom-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button
                @click="createNewMaterial"
                :class="[active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900', 'group flex w-full items-center px-4 py-3 text-sm font-medium']"
              >
                <CubeIcon class="mr-3 h-5 w-5" />
                Thêm vật liệu mới
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="createNewLocation"
                :class="[active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900', 'group flex w-full items-center px-4 py-3 text-sm font-medium']"
              >
                <MapPinIcon class="mr-3 h-5 w-5" />
                Tạo vị trí mới
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="createNewTransaction"
                :class="[active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900', 'group flex w-full items-center px-4 py-3 text-sm font-medium']"
              >
                <ArrowsRightLeftIcon class="mr-3 h-5 w-5" />
                Tạo giao dịch mới
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="viewReports"
                :class="[active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900', 'group flex w-full items-center px-4 py-3 text-sm font-medium']"
              >
                <DocumentChartBarIcon class="mr-3 h-5 w-5" />
                Xem báo cáo
              </button>
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>

    <!-- Notifications Container -->
    <div id="notifications-container" class="fixed top-4 right-4 z-50"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../store/dashboardStore'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  PlusIcon,
  CubeIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'

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

// Reactive data
const showBackToTop = ref(false)

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
    showNotification('Thành công', 'Dashboard đã được cập nhật', 'success')
  } catch (error) {
    showNotification('Lỗi', 'Lỗi khi làm mới dashboard', 'error')
  }
}

const refreshActivities = async () => {
  try {
    await dashboardStore.fetchRecentActivities()
    showNotification('Thành công', 'Đã cập nhật hoạt động gần đây', 'success')
  } catch (error) {
    showNotification('Lỗi', 'Lỗi khi cập nhật hoạt động', 'error')
  }
}

const handleRestock = (alert) => {
  showNotification('Nhập thêm vật liệu', `Chuẩn bị nhập thêm: ${alert.materialName}`, 'info')
  // TODO: Navigate to restock page or open dialog
  console.log('Restock material:', alert)
}

const handleViewStockDetails = (alert) => {
  // TODO: Navigate to material details page
  console.log('View stock details:', alert)
}

const handleViewAllAlerts = () => {
  router.push('/materials/alerts')
}

const handleViewAllActivities = () => {
  router.push('/audit')
}

const handleViewMaterial = (material) => {
  console.log('View material:', material)
}

const handleManageMaterial = (material) => {
  console.log('Manage material:', material)
}

const handleViewAllMaterials = () => {
  router.push('/materials/materials')
}

const handleMaterialPeriodChange = (period) => {
  showNotification('Thông tin', `Đổi khoảng thời gian: ${period}`, 'info')
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
  showNotification('Thông tin', 'Tính năng báo cáo đang phát triển', 'info')
}

// Scroll handling
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Simple notification system
const showNotification = (title, message, type = 'info') => {
  const notification = document.createElement('div')
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }
  
  notification.className = `${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg mb-4 transform transition-all duration-300 translate-x-full`
  notification.innerHTML = `
    <div class="flex items-center">
      <div class="flex-1">
        <div class="font-semibold">${title}</div>
        <div class="text-sm opacity-90">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `
  
  const container = document.getElementById('notifications-container') || document.body
  container.appendChild(notification)
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full')
  }, 100)
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full')
    setTimeout(() => notification.remove(), 300)
  }, 5000)
}

// Lifecycle
onMounted(async () => {
  // Load dashboard data
  await dashboardStore.fetchAllDashboardData()
  
  // Setup scroll listener for back to top button
  window.addEventListener('scroll', handleScroll)
  
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
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Custom animations for dashboard cards */
.space-y-8 > * {
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

/* Stagger animation delays */
.space-y-8 > *:nth-child(1) { animation-delay: 0.1s; }
.space-y-8 > *:nth-child(2) { animation-delay: 0.2s; }
.space-y-8 > *:nth-child(3) { animation-delay: 0.3s; }
.space-y-8 > *:nth-child(4) { animation-delay: 0.4s; }

/* Custom scrollbar */
:deep(*::-webkit-scrollbar) {
  width: 6px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: #a1a1a1;
}
</style>
