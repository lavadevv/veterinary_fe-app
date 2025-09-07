<template>
  <div class="space-y-6">
    <!-- Filter Panel -->
    <FilterPanel
      :filters="filters"
      :materials="materials"
      @update:filters="handleFilterUpdate"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="text-2xl font-bold text-gray-900">{{ stats.total }}</div>
        <div class="text-sm text-gray-500">Tổng số lô</div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="text-2xl font-bold text-green-600">{{ stats.usable }}</div>
        <div class="text-sm text-gray-500">Sẵn sàng sử dụng</div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="text-2xl font-bold text-yellow-600">{{ stats.nearExpiry }}</div>
        <div class="text-sm text-gray-500">Sắp hết hạn</div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="text-2xl font-bold text-red-600">{{ stats.expired }}</div>
        <div class="text-sm text-gray-500">Đã hết hạn</div>
      </div>
    </div>

    <!-- List Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center space-x-4">
        <div class="text-sm text-gray-500">
          Hiển thị {{ ((currentPage - 1) * pageSize) + 1 }}-{{ Math.min(currentPage * pageSize, total) }} 
          trong tổng số {{ total }} lô
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Page Size -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-500">Số lượng/trang:</label>
          <Listbox v-model="pageSize">
            <div class="relative">
              <ListboxButton class="relative w-20 py-1.5 pl-3 pr-8 text-left bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <span class="block truncate">{{ pageSize }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
                </span>
              </ListboxButton>
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 focus:outline-none">
                  <ListboxOption
                    v-for="size in pageSizeOptions"
                    :key="size"
                    :value="size"
                    :class="({ active, selected }) => [
                      'relative cursor-pointer select-none py-2 pl-3 pr-9',
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    ]"
                  >
                    <span :class="['block truncate', selected ? 'font-medium' : 'font-normal']">
                      {{ size }}
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        <!-- View Toggle -->
        <div class="flex items-center border border-gray-300 rounded-md">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'px-3 py-1.5 text-sm rounded-l-md transition-colors',
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            <Squares2X2Icon class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'table'"
            :class="[
              'px-3 py-1.5 text-sm rounded-r-md border-l border-gray-300 transition-colors',
              viewMode === 'table' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            <TableCellsIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!batches.length" class="text-center py-12">
      <BeakerIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có lô vật liệu nào</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ hasActiveFilters ? 'Không tìm thấy kết quả phù hợp với bộ lọc.' : 'Bắt đầu bằng cách tạo lô vật liệu đầu tiên.' }}
      </p>
      <div class="mt-6">
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Xóa bộ lọc
        </button>
        <button
          v-else
          @click="$emit('create')"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Tạo lô mới
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BatchCard
        v-for="batch in batches"
        :key="batch.id"
        :batch="batch"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @update-quantity="$emit('update-quantity', $event)"
        @move-location="$emit('move-location', $event)"
        @update-status="$emit('update-status', $event)"
      />
    </div>

    <!-- Table View -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lô vật liệu
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vật liệu
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày hết hạn
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vị trí
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="batch in batches"
              :key="batch.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ batch.batchNumber }}</div>
                <div class="text-xs text-gray-500">{{ batch.internalBatchCode }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-gray-900">{{ batch.materialDto?.materialName }}</div>
                <div class="text-xs text-gray-500">{{ batch.materialDto?.materialCode }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatNumber(batch.currentQuantity) }}/{{ formatNumber(batch.receivedQuantity) }}
                </div>
                <div class="text-xs text-gray-500">{{ batch.materialDto?.unitOfMeasure }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <StatusBadge type="test" :status="batch.testStatus" />
                  <StatusBadge type="usage" :status="batch.usageStatus" />
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div v-if="batch.expiryDate" class="flex items-center space-x-2">
                  <span class="text-sm text-gray-900">{{ formatDate(batch.expiryDate) }}</span>
                  <ExpiryAlert :expiry-date="batch.expiryDate" />
                </div>
                <div v-else class="text-sm text-gray-400">-</div>
              </td>
              <td class="px-4 py-4">
                <div v-if="batch.locationDto" class="text-sm text-gray-900">
                  {{ batch.locationDto.locationCode }}
                </div>
                <div v-if="batch.locationDto?.warehouseDto" class="text-xs text-gray-500">
                  {{ batch.locationDto.warehouseDto.warehouseName }}
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Menu as="div" class="relative inline-block text-left">
                  <MenuButton class="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <EllipsisHorizontalIcon class="w-5 h-5" />
                  </MenuButton>
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
                      <div class="py-1">
                        <MenuItem>
                          <button
                            @click="$emit('view', batch)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <EyeIcon class="w-4 h-4 mr-3" />
                            Xem chi tiết
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            @click="$emit('edit', batch)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <PencilIcon class="w-4 h-4 mr-3" />
                            Chỉnh sửa
                          </button>
                        </MenuItem>
                        <MenuItem v-if="canUpdateQuantity(batch)">
                          <button
                            @click="$emit('update-quantity', batch)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <ScaleIcon class="w-4 h-4 mr-3" />
                            Cập nhật số lượng
                          </button>
                        </MenuItem>
                        <MenuItem v-if="canMove(batch)">
                          <button
                            @click="$emit('move-location', batch)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <ArrowsRightLeftIcon class="w-4 h-4 mr-3" />
                            Chuyển vị trí
                          </button>
                        </MenuItem>
                        <MenuItem v-if="canUpdateStatus(batch)">
                          <button
                            @click="$emit('update-status', batch)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <CogIcon class="w-4 h-4 mr-3" />
                            Cập nhật trạng thái
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg sm:px-6">
      <div class="flex justify-between flex-1 sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Hiển thị <span class="font-medium">{{ ((currentPage - 1) * pageSize) + 1 }}</span> đến 
            <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span> trong tổng số 
            <span class="font-medium">{{ total }}</span> kết quả
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon class="w-5 h-5" />
            </button>
            
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-medium border',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon class="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'
import {
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  TableCellsIcon,
  BeakerIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  ScaleIcon,
  ArrowsRightLeftIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

import FilterPanel from './FilterPanel.vue'
import BatchCard from './BatchCard.vue'
import StatusBadge from './StatusBadge.vue'
import ExpiryAlert from './ExpiryAlert.vue'
import { USAGE_STATUS } from '../constants'

const props = defineProps({
  batches: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  filters: {
    type: Object,
    required: true
  },
  materials: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:filters',
  'update:page',
  'update:page-size',
  'create',
  'view',
  'edit',
  'update-quantity',
  'move-location',
  'update-status',
  'clear-filters'
])

const viewMode = ref('grid')
const pageSize = ref(10)
const pageSizeOptions = [10, 20, 50, 100]

const hasActiveFilters = computed(() => {
  return props.filters.search ||
         props.filters.materialId ||
         props.filters.testStatus ||
         props.filters.usageStatus ||
         props.filters.sortBy !== 'id' ||
         props.filters.sortDir !== 'desc'
})

const stats = computed(() => {
  const total = props.total
  const usable = props.batches.filter(b => b.usageStatus === USAGE_STATUS.SAN_SANG_SU_DUNG).length
  const nearExpiry = props.batches.filter(b => {
    if (!b.expiryDate) return false
    const days = Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 && days <= 30
  }).length
  const expired = props.batches.filter(b => {
    if (!b.expiryDate) return false
    return new Date(b.expiryDate) < new Date()
  }).length

  return { total, usable, nearExpiry, expired }
})

const visiblePages = computed(() => {
  const pages = []
  const totalPages = props.totalPages
  const current = props.currentPage
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (current >= totalPages - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }
  }
  
  return pages
})

const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const canUpdateQuantity = (batch) => {
  return batch.usageStatus === USAGE_STATUS.SAN_SANG_SU_DUNG || 
         batch.usageStatus === USAGE_STATUS.DANG_SU_DUNG
}

const canMove = (batch) => {
  return batch.usageStatus !== USAGE_STATUS.DA_HET &&
         batch.usageStatus !== USAGE_STATUS.HONG
}

const canUpdateStatus = (batch) => {
  return batch.usageStatus !== USAGE_STATUS.DA_HET
}

const handleFilterUpdate = (newFilters) => {
  emit('update:filters', newFilters)
}

const previousPage = () => {
  if (props.currentPage > 1) {
    emit('update:page', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:page', props.currentPage + 1)
  }
}

const goToPage = (page) => {
  if (page !== '...' && page !== props.currentPage) {
    emit('update:page', page)
  }
}

const clearFilters = () => {
  emit('clear-filters')
}

// Watch page size changes
watch(pageSize, (newSize) => {
  emit('update:page-size', newSize)
})
</script>
