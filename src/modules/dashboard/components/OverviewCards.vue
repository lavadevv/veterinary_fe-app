<template>
  <div class="space-y-6">
    <!-- Main Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Users -->
      <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <UsersIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-500">Tổng người dùng</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(overview.totalUsers) }}</p>
            <div v-if="overview.userGrowth > 0" class="flex items-center text-sm text-green-600 mt-1">
              <ArrowTrendingUpIcon class="w-3 h-3 mr-1" />
              +{{ overview.userGrowth }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Total Materials -->
      <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <CubeIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-500">Tổng vật liệu</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(overview.totalMaterials) }}</p>
            <div v-if="overview.materialGrowth > 0" class="flex items-center text-sm text-green-600 mt-1">
              <ArrowTrendingUpIcon class="w-3 h-3 mr-1" />
              +{{ overview.materialGrowth }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Total Transactions -->
      <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <ArrowsRightLeftIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-500">Tổng giao dịch</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(overview.totalTransactions) }}</p>
            <div v-if="overview.transactionGrowth > 0" class="flex items-center text-sm text-green-600 mt-1">
              <ArrowTrendingUpIcon class="w-3 h-3 mr-1" />
              +{{ overview.transactionGrowth }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Alerts -->
      <div class="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-500">Cảnh báo tồn kho</p>
            <p class="text-2xl font-bold text-gray-900">{{ overview.lowStockAlerts }}</p>
            <div class="flex items-center text-sm text-red-600 mt-1">
              <ExclamationCircleIcon class="w-3 h-3 mr-1" />
              Cần xử lý
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <BuildingStorefrontIcon class="w-8 h-8 text-indigo-600 mr-3" />
          <div>
            <p class="text-lg font-bold text-gray-900">{{ overview.totalWarehouses || 0 }}</p>
            <p class="text-sm text-gray-500">Tổng kho</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <MapPinIcon class="w-8 h-8 text-emerald-600 mr-3" />
          <div>
            <p class="text-lg font-bold text-gray-900">{{ overview.availableLocations || 0 }}/{{ overview.totalLocations || 0 }}</p>
            <p class="text-sm text-gray-500">Vị trí khả dụng</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <ChartPieIcon class="w-8 h-8 text-yellow-600 mr-3" />
          <div>
            <p class="text-lg font-bold text-gray-900">{{ overview.capacityUtilization || 0 }}%</p>
            <p class="text-sm text-gray-500">Tỷ lệ sử dụng</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <ClockIcon class="w-8 h-8 text-purple-600 mr-3" />
          <div>
            <p class="text-lg font-bold text-gray-900">{{ overview.totalCapacity || 0 }}%</p>
            <p class="text-sm text-gray-500">Hiệu suất tổng</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div class="ml-4 flex-1">
            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div class="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div class="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  UsersIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ChartPieIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  overview: {
    type: Object,
    default: () => ({
      totalUsers: 0,
      totalMaterials: 0,
      totalTransactions: 0,
      lowStockAlerts: 0,
      userGrowth: 0,
      materialGrowth: 0,
      transactionGrowth: 0,
      totalWarehouses: 0,
      availableLocations: 0,
      totalLocations: 0,
      capacityUtilization: 0,
      totalCapacity: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Methods
const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toLocaleString('vi-VN')
}
</script>

<style scoped>
/* Card hover animations */
.group:hover {
  transform: translateY(-2px);
}

/* Loading skeleton animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
