<!-- WarehouseTable.vue - Enhanced warehouse table with responsive design -->
<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
        <svg class="animate-spin w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-gray-500 text-sm sm:text-base">Đang tải dữ liệu...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!warehouses?.length" class="text-center py-8 sm:py-12">
      <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <BuildingStorefrontIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không có kho nào</h3>
      <p class="text-gray-500 text-sm sm:text-base">Chưa có kho nào được tạo hoặc không tìm thấy kết quả phù hợp.</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  :checked="isAllSelected"
                  @change="handleSelectAll"
                  type="checkbox"
                  class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                @click="handleSort(column.key)"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ column.label }}</span>
                  <div class="flex flex-col">
                    <ChevronUpIcon
                      :class="[
                        'w-3 h-3',
                        currentSort.field === column.key && currentSort.direction === 'ASC' 
                          ? 'text-emerald-600' 
                          : 'text-gray-400'
                      ]"
                    />
                    <ChevronDownIcon
                      :class="[
                        'w-3 h-3 -mt-1',
                        currentSort.field === column.key && currentSort.direction === 'DESC' 
                          ? 'text-emerald-600' 
                          : 'text-gray-400'
                      ]"
                    />
                  </div>
                </div>
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :class="[
                'hover:bg-gray-50 transition-colors duration-200',
                isSelected(warehouse) ? 'bg-emerald-50' : ''
              ]"
            >
              <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  :checked="isSelected(warehouse)"
                  @change="toggleSelection(warehouse)"
                  type="checkbox"
                  class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>
              
              <!-- Warehouse Code -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {{ getInitials(warehouse.warehouseCode) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ warehouse.warehouseCode }}</div>
                    <div class="text-sm text-gray-500">{{ warehouse.warehouseName }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Warehouse Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getTypeColor(warehouse.warehouseType)
                ]">
                  {{ warehouse.warehouseType }}
                </span>
              </td>
              
              <!-- Address -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" :title="warehouse.address">
                  {{ warehouse.address }}
                </div>
              </td>
              
              <!-- Manager -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ warehouse.managerName || 'Chưa có' }}</div>
              </td>
              
              <!-- Temperature & Humidity -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ warehouse.temperatureRange || 'N/A' }}</div>
                <div class="text-sm text-gray-500">{{ warehouse.humidityRange || 'N/A' }}</div>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  warehouse.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  <span :class="[
                    'w-1.5 h-1.5 rounded-full mr-1.5',
                    warehouse.isActive ? 'bg-green-400' : 'bg-red-400'
                  ]"></span>
                  {{ warehouse.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Menu as="div" class="relative inline-block text-left">
                  <MenuButton class="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-full p-1">
                    <span class="sr-only">Open options</span>
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
                    <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            @click="$emit('view', warehouse)"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm w-full']"
                          >
                            <EyeIcon class="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                            Xem chi tiết
                          </button>
                        </MenuItem>
                        <MenuItem v-if="canEdit" v-slot="{ active }">
                          <button
                            @click="$emit('edit', warehouse)"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm w-full']"
                          >
                            <PencilIcon class="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                            Chỉnh sửa
                          </button>
                        </MenuItem>
                        <MenuItem v-if="canToggleStatus" v-slot="{ active }">
                          <button
                            @click="$emit('toggle-status', warehouse)"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm w-full']"
                          >
                            <CommandLineIcon class="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                            {{ warehouse.isActive ? 'Ngừng hoạt động' : 'Kích hoạt' }}
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4">
        <div
          v-for="warehouse in warehouses"
          :key="warehouse.id"
          :class="[
            'bg-white border border-gray-200 rounded-lg p-4 space-y-3 transition-all duration-200',
            isSelected(warehouse) ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:shadow-md'
          ]"
        >
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <input
                :checked="isSelected(warehouse)"
                @change="toggleSelection(warehouse)"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {{ getInitials(warehouse.warehouseCode) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-gray-900 truncate">{{ warehouse.warehouseCode }}</div>
                <div class="text-sm text-gray-500 truncate">{{ warehouse.warehouseName }}</div>
              </div>
            </div>
            
            <!-- Status Badge -->
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
              warehouse.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]">
              <span :class="[
                'w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0',
                warehouse.isActive ? 'bg-green-400' : 'bg-red-400'
              ]"></span>
              {{ warehouse.isActive ? 'Hoạt động' : 'Tạm dừng' }}
            </span>
          </div>

          <!-- Details -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Loại kho:</span>
              <span :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                getTypeColor(warehouse.warehouseType)
              ]">
                {{ warehouse.warehouseType }}
              </span>
            </div>
            
            <div class="flex items-start justify-between">
              <span class="text-xs text-gray-500">Địa chỉ:</span>
              <span class="text-xs text-gray-900 text-right max-w-48 truncate" :title="warehouse.address">
                {{ warehouse.address }}
              </span>
            </div>
            
            <div v-if="warehouse.managerName" class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Quản lý:</span>
              <span class="text-xs text-gray-900 text-right">{{ warehouse.managerName }}</span>
            </div>
            
            <div v-if="warehouse.temperatureRange" class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Nhiệt độ:</span>
              <span class="text-xs text-gray-900">{{ warehouse.temperatureRange }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
            <button
              @click="$emit('view', warehouse)"
              class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <EyeIcon class="w-3 h-3 mr-1" />
              Xem
            </button>
            <button
              v-if="canEdit"
              @click="$emit('edit', warehouse)"
              class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <PencilIcon class="w-3 h-3 mr-1" />
              Sửa
            </button>
            <button
              v-if="canToggleStatus"
              @click="$emit('toggle-status', warehouse)"
              :class="[
                'inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
                warehouse.isActive 
                  ? 'border-red-300 text-red-700 bg-white hover:bg-red-50' 
                  : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
              ]"
            >
              <CommandLineIcon class="w-3 h-3 mr-1" />
              {{ warehouse.isActive ? 'Ngừng' : 'Bật' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="warehouses?.length" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <div class="flex items-center text-sm text-gray-500 order-2 sm:order-1">
          <span>Hiển thị {{ startRecord }} - {{ endRecord }} trong tổng số {{ pagination.total }} kho</span>
        </div>
        
        <!-- Page Size Selector -->
        <div class="flex items-center space-x-2 order-1 sm:order-2">
          <label class="text-sm text-gray-500">Hiển thị:</label>
          <select
            :value="pagination.pageSize"
            @change="handlePageSizeChange"
            class="border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-gray-500">bản ghi</span>
        </div>
        
        <!-- Pagination Controls -->
        <nav class="flex items-center space-x-1 order-3 sm:order-3" aria-label="Pagination">
          <button
            @click="goToPage(pagination.current - 1)"
            :disabled="pagination.current <= 1"
            :class="[
              'px-2 py-1 text-sm border rounded-md transition-colors duration-200',
              pagination.current <= 1
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            Trước
          </button>
          
          <div class="flex items-center space-x-1">
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 text-sm border rounded-md transition-colors duration-200',
                  page === pagination.current
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-2 py-1 text-sm text-gray-500">...</span>
            </template>
          </div>
          
          <button
            @click="goToPage(pagination.current + 1)"
            :disabled="pagination.current >= totalPages"
            :class="[
              'px-2 py-1 text-sm border rounded-md transition-colors duration-200',
              pagination.current >= totalPages
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            Sau
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import { 
  EyeIcon, 
  PencilIcon, 
  CommandLineIcon,
  BuildingStorefrontIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/modules/auth'
import { ROLES } from '@/modules/auth/constants/roles'

// Props
const props = defineProps({
  warehouses: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  },
  selected: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits([
  'update:selected', 'view', 'edit', 'toggle-status', 
  'page-change', 'sort-change'
])

// Stores
const authStore = useAuthStore()

// Table columns
const columns = ref([
  { key: 'warehouseCode', label: 'Mã kho' },
  { key: 'warehouseType', label: 'Loại kho' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'managerName', label: 'Quản lý' },
  { key: 'temperatureRange', label: 'Nhiệt độ / Độ ẩm' },
  { key: 'isActive', label: 'Trạng thái' }
])

// Current sort state
const currentSort = ref({
  field: 'id',
  direction: 'DESC'
})

// Permission checks
const canEdit = computed(() => 
  authStore.hasPermission && authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER])
)

const canToggleStatus = computed(() => 
  authStore.hasPermission && authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER])
)

// Selection logic
const isSelected = (warehouse) => {
  return props.selected.some(item => item.id === warehouse.id)
}

const isAllSelected = computed(() => {
  return props.warehouses.length > 0 && props.warehouses.every(warehouse => isSelected(warehouse))
})

const toggleSelection = (warehouse) => {
  if (isSelected(warehouse)) {
    emit('update:selected', props.selected.filter(item => item.id !== warehouse.id))
  } else {
    emit('update:selected', [...props.selected, warehouse])
  }
}

const handleSelectAll = () => {
  if (isAllSelected.value) {
    emit('update:selected', [])
  } else {
    emit('update:selected', [...props.warehouses])
  }
}

// Sorting
const handleSort = (field) => {
  if (currentSort.value.field === field) {
    currentSort.value.direction = currentSort.value.direction === 'ASC' ? 'DESC' : 'ASC'
  } else {
    currentSort.value.field = field
    currentSort.value.direction = 'ASC'
  }
  
  emit('sort-change', {
    sortField: currentSort.value.field,
    sortType: currentSort.value.direction
  })
}

// Pagination
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.pageSize))

const startRecord = computed(() => {
  if (props.pagination.total === 0) return 0
  return (props.pagination.current - 1) * props.pagination.pageSize + 1
})

const endRecord = computed(() => {
  const end = props.pagination.current * props.pagination.pageSize
  return end > props.pagination.total ? props.pagination.total : end
})

const visiblePages = computed(() => {
  const current = props.pagination.current
  const total = totalPages.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.pagination.current) {
    emit('page-change', page)
  }
}

const handlePageSizeChange = (event) => {
  const newPageSize = parseInt(event.target.value)
  emit('page-change', 1, newPageSize)
}

// Helper functions
const getInitials = (text) => {
  if (!text) return 'W'
  return text.substring(0, 2).toUpperCase()
}

const getTypeColor = (type) => {
  const colors = {
    'Kho nguyên liệu': 'bg-blue-100 text-blue-800',
    'Kho bao bì': 'bg-purple-100 text-purple-800',
    'Thành phẩm': 'bg-green-100 text-green-800',
    'Kho phụ liệu': 'bg-orange-100 text-orange-800',
    'Kho tạm': 'bg-gray-100 text-gray-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}
</script>
