<template>
  <div class="bg-white rounded-xl shadow-sm border border-emerald-100 h-full flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <ExclamationTriangleIcon class="w-5 h-5 mr-2 text-orange-500" />
          Cảnh báo tồn kho
          <span v-if="totalAlertsCount > 0" 
                class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="criticalAlertsCount > 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'">
            {{ totalAlertsCount }}
          </span>
        </h3>
        
        <Menu as="div" class="relative">
          <MenuButton class="inline-flex items-center p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md">
            <FunnelIcon class="w-4 h-4" />
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem v-slot="{ active }">
                <button
                  @click="filterType = 'all'"
                  :class="[active ? 'bg-gray-100' : '', filterType === 'all' ? 'text-emerald-600 font-medium' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                >
                  Tất cả
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="filterType = 'critical'"
                  :class="[active ? 'bg-gray-100' : '', filterType === 'critical' ? 'text-emerald-600 font-medium' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                >
                  Nghiêm trọng
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="filterType = 'warning'"
                  :class="[active ? 'bg-gray-100' : '', filterType === 'warning' ? 'text-emerald-600 font-medium' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                >
                  Cảnh báo
                </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="flex space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Summary -->
      <div v-else-if="alerts.length > 0" class="space-y-4">
        <div class="flex space-x-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center text-sm text-red-600">
            <ExclamationCircleIcon class="w-4 h-4 mr-1" />
            <span class="font-medium">{{ criticalAlertsCount }}</span>
            <span class="ml-1">nghiêm trọng</span>
          </div>
          <div class="flex items-center text-sm text-yellow-600">
            <ExclamationTriangleIcon class="w-4 h-4 mr-1" />
            <span class="font-medium">{{ warningAlertsCount }}</span>
            <span class="ml-1">cảnh báo</span>
          </div>
        </div>

        <!-- Alerts List -->
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div 
            v-for="alert in filteredAlerts" 
            :key="alert.id"
            class="border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
            :class="getAlertBorderClass(alert.alertLevel)"
          >
            <div class="flex items-start space-x-3">
              <!-- Alert Icon -->
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                     :class="getAlertIconClass(alert.alertLevel)">
                  <component :is="getAlertIcon(alert.alertLevel)" class="w-4 h-4" />
                </div>
              </div>
              
              <!-- Alert Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-medium text-gray-900 truncate">{{ alert.materialName }}</h4>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="getAlertLevelClass(alert.alertLevel)">
                    {{ alert.alertLevel === 'critical' ? 'Nghiêm trọng' : 'Cảnh báo' }}
                  </span>
                </div>
                
                <div class="space-y-1 text-xs text-gray-500">
                  <div class="flex justify-between">
                    <span>Hiện tại: <span class="font-medium text-gray-900">{{ alert.currentStock }}</span></span>
                    <span>Tối thiểu: <span class="font-medium text-gray-900">{{ alert.minStock }}</span></span>
                  </div>
                  
                  <div class="flex items-center">
                    <MapPinIcon class="w-3 h-3 mr-1" />
                    <span>{{ alert.location }} - {{ alert.warehouse }}</span>
                  </div>
                  
                  <div class="flex items-center">
                    <TagIcon class="w-3 h-3 mr-1" />
                    <span>{{ alert.category }}</span>
                  </div>
                  
                  <div v-if="alert.daysUntilEmpty" class="flex items-center">
                    <ClockIcon class="w-3 h-3 mr-1" />
                    <span :class="alert.daysUntilEmpty <= 5 ? 'text-red-600 font-medium' : ''">
                      Còn {{ alert.daysUntilEmpty }} ngày
                    </span>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-2 mt-3">
                  <button
                    @click="handleRestock(alert)"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-emerald-600 border border-transparent rounded hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <PlusIcon class="w-3 h-3 mr-1" />
                    Nhập thêm
                  </button>
                  <button
                    @click="handleViewDetails(alert)"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-transparent rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <EyeIcon class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Alerts -->
      <div v-else class="flex flex-col items-center justify-center h-40">
        <CheckCircleIcon class="w-12 h-12 text-green-500 mb-2" />
        <p class="text-gray-500 text-sm">Không có cảnh báo nào</p>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="alerts.length > 5" class="p-4 border-t border-gray-200">
      <button
        @click="viewAllAlerts"
        class="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center"
      >
        Xem tất cả {{ alerts.length }} cảnh báo
        <ArrowRightIcon class="w-3 h-3 ml-1" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  FunnelIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  alerts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['restock', 'view-details', 'view-all'])

// Reactive data
const filterType = ref('all')

// Computed
const criticalAlertsCount = computed(() => 
  props.alerts.filter(alert => alert.alertLevel === 'critical').length
)

const warningAlertsCount = computed(() => 
  props.alerts.filter(alert => alert.alertLevel === 'warning').length
)

const totalAlertsCount = computed(() => props.alerts.length)

const filteredAlerts = computed(() => {
  let filtered = props.alerts
  
  if (filterType.value === 'critical') {
    filtered = filtered.filter(alert => alert.alertLevel === 'critical')
  } else if (filterType.value === 'warning') {
    filtered = filtered.filter(alert => alert.alertLevel === 'warning')
  }
  
  // Limit to 5 items for display
  return filtered.slice(0, 5)
})

// Methods
const getAlertIcon = (level) => {
  return level === 'critical' ? ExclamationCircleIcon : ExclamationTriangleIcon
}

const getAlertIconClass = (level) => {
  return level === 'critical' 
    ? 'bg-red-100 text-red-600' 
    : 'bg-yellow-100 text-yellow-600'
}

const getAlertBorderClass = (level) => {
  return level === 'critical'
    ? 'border-red-200 bg-red-50'
    : 'border-yellow-200 bg-yellow-50'
}

const getAlertLevelClass = (level) => {
  return level === 'critical'
    ? 'bg-red-100 text-red-800'
    : 'bg-yellow-100 text-yellow-800'
}

const handleRestock = (alert) => {
  emit('restock', alert)
}

const handleViewDetails = (alert) => {
  emit('view-details', alert)
}

const viewAllAlerts = () => {
  emit('view-all')
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
