<template>
  <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <ChartPieIcon class="w-5 h-5 mr-2 text-emerald-500" />
        Danh mục vật liệu
      </h3>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <!-- Chart Container -->
    <div v-else-if="categories.length > 0" class="space-y-4">
      <!-- Mock Chart Area -->
      <div class="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-emerald-200">
        <div class="text-center">
          <ChartPieIcon class="w-16 h-16 text-emerald-400 mx-auto mb-2" />
          <p class="text-emerald-600 font-medium">Biểu đồ tròn danh mục</p>
          <p class="text-sm text-gray-500">{{ categories.length }} danh mục</p>
        </div>
      </div>

      <!-- Legend -->
      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="(category, index) in categories" 
          :key="category.name"
          class="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg"
        >
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: getColor(index) }"
          ></div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ category.name }}</p>
            <p class="text-xs text-gray-500">{{ formatNumber(category.count) }} vật liệu</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data -->
    <div v-else class="flex flex-col items-center justify-center h-64">
      <ChartPieIcon class="w-16 w-16 text-gray-300 mb-4" />
      <p class="text-gray-500">Không có dữ liệu danh mục</p>
    </div>
  </div>
</template>

<script setup>
import { ChartPieIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Methods
const getColor = (index) => {
  const colors = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', 
    '#ef4444', '#06b6d4', '#84cc16', '#f97316'
  ]
  return colors[index % colors.length]
}

const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toLocaleString('vi-VN')
}
</script>
