<template>
  <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <ChartPieIcon class="w-5 h-5 mr-2 text-emerald-500" />
        Hiệu suất hệ thống
      </h3>
      
      <!-- Time Range Selector -->
      <Listbox v-model="selectedPeriod" as="div" class="relative">
        <ListboxButton class="relative cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left text-sm border border-gray-300 hover:border-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
          <span class="block truncate">{{ selectedPeriod.name }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-4 w-4 text-gray-400" />
          </span>
        </ListboxButton>
        
        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ListboxOption
              v-for="period in periods"
              :key="period.value"
              :value="period"
              v-slot="{ active, selected }"
              as="template"
            >
              <li class="relative cursor-pointer select-none py-2 pl-3 pr-9" :class="[active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900']">
                <span class="block truncate" :class="[selected ? 'font-medium' : 'font-normal']">
                  {{ period.name }}
                </span>
                <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-600">
                  <CheckIcon class="h-4 w-4" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </Listbox>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 4" :key="n" class="animate-pulse">
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 bg-gray-200 rounded"></div>
          <div class="flex-1 h-4 bg-gray-200 rounded"></div>
          <div class="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div v-else class="space-y-4">
      <!-- Response Time -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span class="text-sm font-medium text-gray-700">Thời gian phản hồi</span>
          </div>
          <span class="text-sm font-bold text-blue-600">{{ metrics.responseTime }}ms</span>
        </div>
        <div class="w-full bg-blue-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(100, (metrics.responseTime / 1000) * 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Mục tiêu: < 500ms</p>
      </div>

      <!-- System Load -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
            <span class="text-sm font-medium text-gray-700">Tải hệ thống</span>
          </div>
          <span class="text-sm font-bold text-emerald-600">{{ metrics.systemLoad }}%</span>
        </div>
        <div class="w-full bg-emerald-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${metrics.systemLoad}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Cảnh báo: > 80%</p>
      </div>

      <!-- Memory Usage -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
            <span class="text-sm font-medium text-gray-700">Sử dụng bộ nhớ</span>
          </div>
          <span class="text-sm font-bold text-amber-600">{{ metrics.memoryUsage }}%</span>
        </div>
        <div class="w-full bg-amber-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${metrics.memoryUsage}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Cảnh báo: > 85%</p>
      </div>

      <!-- Uptime -->
      <div class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
            <span class="text-sm font-medium text-gray-700">Thời gian hoạt động</span>
          </div>
          <span class="text-sm font-bold text-purple-600">{{ metrics.uptime }}%</span>
        </div>
        <div class="w-full bg-purple-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${metrics.uptime}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Mục tiêu: > 99%</p>
      </div>
    </div>

    <!-- Overall Score -->
    <div v-if="!loading" class="mt-6 text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg">
      <p class="text-sm text-gray-600 mb-1">Điểm tổng thể</p>
      <div class="flex items-center justify-center">
        <span class="text-2xl font-bold" :class="getOverallScoreColor()">
          {{ getOverallScore() }}
        </span>
        <span class="text-lg text-gray-500 ml-1">/100</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ getPerformanceStatus() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Listbox, 
  ListboxButton, 
  ListboxOptions, 
  ListboxOption 
} from '@headlessui/vue'
import { 
  ChartPieIcon,
  ChevronUpDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({
      responseTime: 234,
      systemLoad: 67,
      memoryUsage: 73,
      uptime: 99.8
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Data
const periods = [
  { value: 'last24h', name: '24 giờ qua' },
  { value: 'last7d', name: '7 ngày qua' },
  { value: 'last30d', name: '30 ngày qua' },
  { value: 'last90d', name: '90 ngày qua' }
]

const selectedPeriod = ref(periods[0])

// Computed
const getOverallScore = () => {
  const responseScore = Math.max(0, 100 - (props.metrics.responseTime / 10))
  const loadScore = Math.max(0, 100 - props.metrics.systemLoad)
  const memoryScore = Math.max(0, 100 - props.metrics.memoryUsage)
  const uptimeScore = props.metrics.uptime
  
  return Math.round((responseScore + loadScore + memoryScore + uptimeScore) / 4)
}

const getOverallScoreColor = () => {
  const score = getOverallScore()
  if (score >= 90) return 'text-emerald-600'
  if (score >= 75) return 'text-amber-600'
  return 'text-red-600'
}

const getPerformanceStatus = () => {
  const score = getOverallScore()
  if (score >= 90) return 'Hiệu suất tuyệt vời'
  if (score >= 75) return 'Hiệu suất tốt'
  if (score >= 60) return 'Hiệu suất trung bình'
  return 'Cần cải thiện'
}
</script>
