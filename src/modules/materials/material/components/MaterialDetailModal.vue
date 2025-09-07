<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="isOpen && material">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Backdrop -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>

      <!-- Modal -->
      <div class="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative z-50">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            Chi tiết vật liệu
          </h3>
          <button
            @click="closeModal"
            type="button"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="mt-6 space-y-6">
          <!-- Basic Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-500">Mã vật liệu:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.materialCode }}</p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-gray-500">Tên vật liệu:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.materialName }}</p>
              </div>
              
              <div v-if="material.shortName">
                <span class="text-sm font-medium text-gray-500">Tên viết tắt:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.shortName }}</p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-gray-500">Đơn vị tính:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.unitOfMeasure }}</p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-gray-500">Loại vật liệu:</span>
                <p class="mt-1 text-sm text-gray-900">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getMaterialTypeClass(material.materialType)">
                    {{ getMaterialTypeLabel(material.materialType) }}
                  </span>
                </p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-gray-500">Dạng vật liệu:</span>
                <p class="mt-1 text-sm text-gray-900">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getMaterialFormClass(material.materialForm)">
                    {{ getMaterialFormLabel(material.materialForm) }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Financial Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Thông tin tài chính</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-500">Giá cố định:</span>
                <p class="mt-1 text-sm text-gray-900">
                  {{ material.fixedPrice ? formatCurrency(material.fixedPrice) : 'Chưa cập nhật' }}
                </p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-gray-500">Tồn kho hiện tại:</span>
                <p class="mt-1 text-sm text-gray-900"
                   :class="getStockClass(material.currentStock, material.minimumStockLevel)">
                  {{ material.currentStock || 0 }} {{ material.unitOfMeasure }}
                </p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-gray-500">Mức tồn kho tối thiểu:</span>
                <p class="mt-1 text-sm text-gray-900">
                  {{ material.minimumStockLevel || 0 }} {{ material.unitOfMeasure }}
                </p>
              </div>
            </div>
          </div>

          <!-- Supplier Information -->
          <div class="bg-gray-50 rounded-lg p-4" v-if="material.supplierDto">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Thông tin nhà cung cấp</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-500">Tên nhà cung cấp:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.supplierDto.supplierName }}</p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-gray-500">Mã nhà cung cấp:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.supplierDto.supplierCode }}</p>
              </div>
              
              <div v-if="material.supplierDto.contactPerson">
                <span class="text-sm font-medium text-gray-500">Người liên hệ:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.supplierDto.contactPerson }}</p>
              </div>
              
              <div v-if="material.supplierDto.phone">
                <span class="text-sm font-medium text-gray-500">Số điện thoại:</span>
                <p class="mt-1 text-sm text-gray-900">{{ material.supplierDto.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Storage & Additional Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Bảo quản & thông tin bổ sung</h4>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-500 mr-2">Bảo quản lạnh:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="material.requiresColdStorage ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'">
                    {{ material.requiresColdStorage ? 'Có' : 'Không' }}
                  </span>
                </div>
                
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-500 mr-2">Trạng thái:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="material.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ material.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </div>
              </div>
              
              <div v-if="material.notes">
                <span class="text-sm font-medium text-gray-500">Ghi chú:</span>
                <p class="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">{{ material.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          >
            Đóng
          </button>
          <button
            @click="$emit('edit', material)"
            type="button"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  material: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'edit'])

// Methods
const closeModal = () => {
  emit('close')
}

const getMaterialTypeLabel = (type) => {
  const labels = {
    'HOAT_CHAT': 'Hoạt chất',
    'PHU_LIEU': 'Phụ liệu',
    'BAO_BI': 'Bao bì',
    'HOA_CHAT': 'Hóa chất',
    'KHAC': 'Khác'
  }
  return labels[type] || type
}

const getMaterialFormLabel = (form) => {
  const labels = {
    'BOT': 'Bột',
    'VIEN': 'Viên',
    'DUNG_DICH': 'Dung dịch',
    'THUOC_TIM': 'Thuốc tiêm',
    'KHAC': 'Khác'
  }
  return labels[form] || form
}

const getMaterialTypeClass = (type) => {
  const classes = {
    'HOAT_CHAT': 'bg-purple-100 text-purple-800',
    'PHU_LIEU': 'bg-blue-100 text-blue-800',
    'BAO_BI': 'bg-green-100 text-green-800',
    'HOA_CHAT': 'bg-yellow-100 text-yellow-800',
    'KHAC': 'bg-gray-100 text-gray-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getMaterialFormClass = (form) => {
  const classes = {
    'BOT': 'bg-orange-100 text-orange-800',
    'VIEN': 'bg-pink-100 text-pink-800',
    'DUNG_DICH': 'bg-cyan-100 text-cyan-800',
    'THUOC_TIM': 'bg-red-100 text-red-800',
    'KHAC': 'bg-gray-100 text-gray-800'
  }
  return classes[form] || 'bg-gray-100 text-gray-800'
}

const getStockClass = (currentStock, minimumStock) => {
  if (!currentStock || !minimumStock) return 'text-gray-900'
  return currentStock <= minimumStock ? 'text-red-600 font-medium' : 'text-green-600'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
</script>
