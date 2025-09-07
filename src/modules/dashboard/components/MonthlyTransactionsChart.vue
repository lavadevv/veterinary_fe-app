<template>
  <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <ChartBarIcon class="w-5 h-5 mr-2 text-emerald-500" />
        Giao dịch theo tháng
      </h3>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-80">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <!-- Chart Container -->
    <div v-else-if="chartData.length > 0" class="space-y-4">
      <!-- Mock Chart Area -->
      <div class="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
        <div class="text-center">
          <ChartBarIcon class="w-20 h-20 text-blue-400 mx-auto mb-4" />
          <p class="text-blue-600 font-medium text-lg">Biểu đồ cột giao dịch</p>
          <p class="text-sm text-gray-500">{{ chartData.length }} tháng dữ liệu</p>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-3 bg-emerald-50 rounded-lg">
          <p class="text-sm text-gray-600">Tổng giao dịch</p>
          <p class="text-lg font-bold text-emerald-600">{{ getTotalTransactions() }}</p>
        </div>
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-600">Trung bình/tháng</p>
          <p class="text-lg font-bold text-blue-600">{{ getAverageTransactions() }}</p>
        </div>
        <div class="text-center p-3 bg-purple-50 rounded-lg">
          <p class="text-sm text-gray-600">Tháng cao nhất</p>
          <p class="text-lg font-bold text-purple-600">{{ getMaxTransactions() }}</p>
        </div>
      </div>
    </div>

    <!-- No Data -->
    <div v-else class="flex flex-col items-center justify-center h-80">
      <ChartBarIcon class="w-20 h-20 text-gray-300 mb-4" />
      <p class="text-gray-500">Không có dữ liệu giao dịch</p>
    </div>
  </div>
</template>

<script setup>
import { ChartBarIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Methods
const getTotalTransactions = () => {
  const total = props.chartData.reduce((sum, item) => sum + (item.transactions || 0), 0)
  return total.toLocaleString('vi-VN')
}

const getAverageTransactions = () => {
  if (props.chartData.length === 0) return '0'
  const total = props.chartData.reduce((sum, item) => sum + (item.transactions || 0), 0)
  const average = Math.round(total / props.chartData.length)
  return average.toLocaleString('vi-VN')
}

const getMaxTransactions = () => {
  if (props.chartData.length === 0) return '0'
  const max = Math.max(...props.chartData.map(item => item.transactions || 0))
  return max.toLocaleString('vi-VN')
}
</script>
