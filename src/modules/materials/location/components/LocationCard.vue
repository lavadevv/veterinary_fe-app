<!-- LocationCard.vue - Component hiển thị thông tin location dạng card -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group overflow-hidden">
    <!-- Header với status -->
    <div class="relative">
      <div class="p-5 sm:p-6 pb-4">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3 mb-3">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {{ location.locationCode }}
              </h3>
              <LocationStatusBadge :status="location.isAvailable" />
            </div>
            
            <p v-if="location.positionDetail" class="text-sm text-gray-600 line-clamp-2 mb-4">
              {{ location.positionDetail }}
            </p>
          </div>

          <!-- Actions dropdown -->
          <div class="flex-shrink-0 relative">
            <Menu as="div" class="relative">
              <MenuButton class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <EllipsisVerticalIcon class="w-5 h-5" />
              </MenuButton>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="emit('view', location)"
                      :class="[
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                        'group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150'
                      ]"
                    >
                      <EyeIcon class="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                      Xem chi tiết
                    </button>
                  </MenuItem>

                  <MenuItem v-if="canEdit" v-slot="{ active }">
                    <button
                      @click="emit('edit', location)"
                      :class="[
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                        'group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150'
                      ]"
                    >
                      <PencilIcon class="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                      Chỉnh sửa
                    </button>
                  </MenuItem>

                  <MenuItem v-if="canToggleStatus" v-slot="{ active }">
                    <button
                      @click="emit('toggle-status', location)"
                      :class="[
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                        'group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150'
                      ]"
                    >
                      <component
                        :is="location.isAvailable ? PauseIcon : PlayIcon"
                        class="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600"
                      />
                      {{ location.isAvailable ? 'Tạm dừng' : 'Kích hoạt' }}
                    </button>
                  </MenuItem>

                  <MenuItem v-if="canDelete" v-slot="{ active }">
                    <button
                      @click="emit('delete', location)"
                      :class="[
                        active ? 'bg-red-50 text-red-900' : 'text-red-700',
                        'group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150'
                      ]"
                    >
                      <TrashIcon class="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600" />
                      Xóa
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>

        <!-- Location details -->
        <div class="grid grid-cols-2 gap-4 text-sm mt-4">
          <div v-if="location.shelf" class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.79 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.79 4 8 4s8-1.79 8-4M4 7c0-2.21 3.79-4 8-4s8 1.79 8 4" />
            </svg>
            <span class="truncate">Kệ: {{ location.shelf }}</span>
          </div>

          <div v-if="location.floor" class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="truncate">Tầng: {{ location.floor }}</span>
          </div>
        </div>
      </div>

      <!-- Capacity bar -->
      <div class="px-5 sm:px-6 pb-5">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Sức chứa</span>
            <span class="font-medium text-gray-900">
              {{ formatCapacity(location.currentCapacity) }} / {{ formatCapacity(location.maxCapacity) }}
            </span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="getCapacityBarColor(capacityPercentage)"
              :style="{ width: `${Math.min(capacityPercentage, 100)}%` }"
            ></div>
          </div>
          
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ capacityPercentage.toFixed(1) }}% sử dụng</span>
            <span v-if="remainingCapacity > 0" class="text-green-600">
              Còn trống: {{ formatCapacity(remainingCapacity) }}
            </span>
            <span v-else-if="remainingCapacity < 0" class="text-red-600">
              Vượt quá: {{ formatCapacity(Math.abs(remainingCapacity)) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Warehouse info (nếu có) -->
    <div v-if="location.warehouse" class="px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div class="flex items-center text-sm text-gray-600">
        <BuildingStorefrontIcon class="w-4 h-4 mr-2 text-gray-400" />
        <span class="truncate">{{ location.warehouse.warehouseName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'
import LocationStatusBadge from './LocationStatusBadge.vue'

// Props
const props = defineProps({
  location: {
    type: Object,
    required: true
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
const emit = defineEmits(['view', 'edit', 'delete', 'toggle-status'])

// Computed
const capacityPercentage = computed(() => {
  if (!props.location.maxCapacity || props.location.maxCapacity === 0) return 0
  return (props.location.currentCapacity / props.location.maxCapacity) * 100
})

const remainingCapacity = computed(() => {
  return props.location.maxCapacity - props.location.currentCapacity
})

// Methods
const formatCapacity = (capacity) => {
  if (!capacity) return '0'
  if (capacity >= 1000) {
    return (capacity / 1000).toFixed(1) + 'K'
  }
  return capacity.toString()
}

const getCapacityBarColor = (percentage) => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-yellow-500'
  if (percentage >= 50) return 'bg-blue-500'
  return 'bg-green-500'
}
</script>
