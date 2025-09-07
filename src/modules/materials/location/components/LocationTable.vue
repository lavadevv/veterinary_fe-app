<!-- LocationTable.vue - Component hiển thị location dạng bảng -->
<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Header -->
        <thead class="bg-gray-50">
          <tr>
            <!-- Select All -->
            <th v-if="canSelect" class="w-12 px-4 py-3">
              <input
                :checked="isAllSelected"
                :indeterminate="isSomeSelected"
                @change="handleSelectAll($event.target.checked)"
                type="checkbox"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>

            <!-- Location Code -->
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã vị trí
            </th>

            <!-- Warehouse -->
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kho
            </th>

            <!-- Position -->
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vị trí
            </th>

            <!-- Capacity -->
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sức chứa
            </th>

            <!-- Status -->
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>

            <!-- Actions -->
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="location in locations"
            :key="location.id"
            :class="[
              'hover:bg-gray-50 transition-colors duration-150',
              selectedLocations.includes(location.id) ? 'bg-blue-50' : ''
            ]"
          >
            <!-- Select -->
            <td v-if="canSelect" class="px-4 py-4">
              <input
                :checked="selectedLocations.includes(location.id)"
                @change="toggleSelection(location.id)"
                type="checkbox"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </td>

            <!-- Location Code -->
            <td class="px-4 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPinIcon class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ location.locationCode }}</div>
                  <div v-if="location.id" class="text-xs text-gray-500 font-mono">ID: {{ location.id }}</div>
                </div>
              </div>
            </td>

            <!-- Warehouse -->
            <td class="px-4 py-4">
              <div v-if="location.warehouse" class="text-sm text-gray-900">
                {{ location.warehouse.warehouseName }}
              </div>
              <div v-else class="text-sm text-gray-400">-</div>
            </td>

            <!-- Position -->
            <td class="px-4 py-4">
              <div class="space-y-1">
                <div v-if="location.shelf" class="text-xs text-gray-600">
                  <span class="font-medium">Kệ:</span> {{ location.shelf }}
                </div>
                <div v-if="location.floor" class="text-xs text-gray-600">
                  <span class="font-medium">Tầng:</span> {{ location.floor }}
                </div>
                <div v-if="location.positionDetail" class="text-xs text-gray-500 line-clamp-2 max-w-48">
                  {{ location.positionDetail }}
                </div>
                <div v-if="!location.shelf && !location.floor && !location.positionDetail" class="text-sm text-gray-400">
                  -
                </div>
              </div>
            </td>

            <!-- Capacity -->
            <td class="px-4 py-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">{{ formatCapacity(location.currentCapacity) }}</span>
                  <span class="text-gray-400">/</span>
                  <span class="font-medium text-gray-900">{{ formatCapacity(location.maxCapacity) }}</span>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full transition-all duration-300"
                    :class="getCapacityBarColor(getCapacityPercentage(location))"
                    :style="{ width: `${Math.min(getCapacityPercentage(location), 100)}%` }"
                  ></div>
                </div>
                
                <div class="text-xs text-gray-500">
                  {{ getCapacityPercentage(location).toFixed(1) }}% sử dụng
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="px-4 py-4">
              <LocationStatusBadge :status="location.isAvailable" size="sm" />
            </td>

            <!-- Actions -->
            <td class="px-4 py-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="emit('view', location)"
                  class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Xem chi tiết"
                >
                  <EyeIcon class="w-4 h-4" />
                </button>

                <button
                  v-if="canEdit"
                  @click="emit('edit', location)"
                  class="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                  title="Chỉnh sửa"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>

                <button
                  v-if="canToggleStatus"
                  @click="emit('toggle-status', location)"
                  class="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  :title="location.isAvailable ? 'Tạm dừng' : 'Kích hoạt'"
                >
                  <component :is="location.isAvailable ? PauseIcon : PlayIcon" class="w-4 h-4" />
                </button>

                <button
                  v-if="canDelete"
                  @click="emit('delete', location)"
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Xóa"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state trong table -->
    <div v-if="locations.length === 0" class="text-center py-12">
      <MapPinIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
      <p class="text-gray-600">Không tìm thấy vị trí kho nào.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  MapPinIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/vue/24/outline'
import LocationStatusBadge from './LocationStatusBadge.vue'

// Props
const props = defineProps({
  locations: {
    type: Array,
    default: () => []
  },
  selectedLocations: {
    type: Array,
    default: () => []
  },
  canSelect: {
    type: Boolean,
    default: true
  },
  canEdit: {
    type: Boolean,
    default: true
  },
  canDelete: {
    type: Boolean,
    default: true
  },
  canToggleStatus: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['select', 'select-all', 'view', 'edit', 'delete', 'toggle-status'])

// Computed
const isAllSelected = computed(() => {
  return props.locations.length > 0 && 
         props.selectedLocations.length === props.locations.length
})

const isSomeSelected = computed(() => {
  return props.selectedLocations.length > 0 && 
         props.selectedLocations.length < props.locations.length
})

// Methods
const toggleSelection = (locationId) => {
  const newSelection = props.selectedLocations.includes(locationId)
    ? props.selectedLocations.filter(id => id !== locationId)
    : [...props.selectedLocations, locationId]
  
  emit('select', newSelection)
}

const handleSelectAll = (isSelected) => {
  emit('select-all', isSelected)
}

const formatCapacity = (capacity) => {
  if (!capacity) return '0'
  if (capacity >= 1000) {
    return (capacity / 1000).toFixed(1) + 'K'
  }
  return capacity.toString()
}

const getCapacityPercentage = (location) => {
  if (!location.maxCapacity || location.maxCapacity === 0) return 0
  return (location.currentCapacity / location.maxCapacity) * 100
}

const getCapacityBarColor = (percentage) => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-yellow-500'
  if (percentage >= 50) return 'bg-blue-500'
  return 'bg-green-500'
}
</script>
