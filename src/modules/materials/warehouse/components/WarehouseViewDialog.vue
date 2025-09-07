<!-- WarehouseViewDialog.vue - Modal for viewing warehouse details -->
<template>
  <TransitionRoot appear :show="visible" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-lg font-semibold text-white">
                        Chi tiết kho
                      </DialogTitle>
                      <p class="text-blue-100 text-sm">{{ warehouse?.warehouseCode }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <!-- Close button with text (mobile-friendly) -->
                    <button
                      @click="closeDialog"
                      class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
                      title="Đóng"
                    >
                      <span class="hidden sm:inline mr-1">Đóng</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <div v-if="warehouse" class="space-y-6">
                  <!-- Basic Information -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thông tin cơ bản
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-500 mb-1">Mã kho</label>
                        <p class="text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded border">{{ warehouse.warehouseCode }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-500 mb-1">Tên kho</label>
                        <p class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ warehouse.warehouseName }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-500 mb-1">Loại kho</label>
                        <span :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getTypeColor(warehouse.warehouseType)
                        ]">
                          {{ warehouse.warehouseType }}
                        </span>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-500 mb-1">Trạng thái</label>
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
                          {{ warehouse.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Location Information -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Thông tin vị trí
                    </h4>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Địa chỉ</label>
                      <p class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ warehouse.address || 'Chưa có thông tin' }}</p>
                    </div>
                  </div>

                  <!-- Management Information -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Thông tin quản lý
                    </h4>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Quản lý kho</label>
                      <p class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ warehouse.managerName || 'Chưa có thông tin' }}</p>
                    </div>
                  </div>

                  <!-- Environmental Conditions -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Điều kiện môi trường
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-500 mb-1">Khoảng nhiệt độ</label>
                        <div class="flex items-center bg-white px-3 py-2 rounded border">
                          <svg class="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l6-2v13M9 19l6 2M9 19l-6-2V6l6-2" />
                          </svg>
                          <span class="text-sm text-gray-900">{{ warehouse.temperatureRange || 'Chưa xác định' }}</span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-500 mb-1">Khoảng độ ẩm</label>
                        <div class="flex items-center bg-white px-3 py-2 rounded border">
                          <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span class="text-sm text-gray-900">{{ warehouse.humidityRange || 'Chưa xác định' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Special Conditions -->
                  <div v-if="warehouse.specialConditions" class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Điều kiện đặc biệt
                    </h4>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <p class="text-sm text-gray-900">{{ warehouse.specialConditions }}</p>
                    </div>
                  </div>

                  <!-- Statistics (Placeholder for future features) -->
                  <!-- <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                    <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Thống kê nhanh
                    </h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-emerald-600">-</div>
                        <div class="text-xs text-gray-600">Vị trí</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">-</div>
                        <div class="text-xs text-gray-600">Vật liệu</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">-</div>
                        <div class="text-xs text-gray-600">Giao dịch</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">-</div>
                        <div class="text-xs text-gray-600">Cảnh báo</div>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 text-center mt-2">Tính năng sẽ được cập nhật sau</p>
                  </div> -->
                </div>

                <!-- Loading State -->
                <div v-else class="flex items-center justify-center py-8">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                    <svg class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div class="flex justify-end space-x-3">
                  <button
                    @click="closeDialog"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Đóng
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  warehouse: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible'])

// Methods
const closeDialog = () => {
  emit('update:visible', false)
}

// Helper function
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
