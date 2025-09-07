<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Mobile card view -->
    <div class="block lg:hidden">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Vật liệu ({{ materials.length }})
        </h3>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div 
          v-for="material in materials" 
          :key="material.id"
          class="p-4 hover:bg-gray-50 cursor-pointer"
          @click="$emit('view', material)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {{ material.materialName }}
                </h4>
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    material.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ material.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Mã:</span> {{ material.materialCode }}
              </p>
              
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Loại:</span> {{ getMaterialTypeLabel(material.materialType) }}
              </p>
              
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Dạng:</span> {{ getMaterialFormLabel(material.materialForm) }}
              </p>
              
              <div class="flex items-center gap-4 mt-2">
                <div class="flex items-center gap-1">
                  <CubeIcon class="h-4 w-4 text-gray-400" />
                  <span class="text-sm text-gray-500">
                    {{ material.currentStock || 0 }} {{ material.unitOfMeasure }}
                  </span>
                </div>
                
                <div v-if="material.fixedPrice" class="flex items-center gap-1">
                  <CurrencyDollarIcon class="h-4 w-4 text-gray-400" />
                  <span class="text-sm text-gray-500">
                    {{ formatCurrency(material.fixedPrice) }}
                  </span>
                </div>
              </div>
              
              <!-- Supplier Info -->
              <div v-if="material.supplierDto" class="mt-2 p-2 bg-gray-50 rounded">
                <p class="text-xs text-gray-600">
                  <span class="font-medium">NCC:</span> {{ material.supplierDto.supplierName }}
                </p>
              </div>
              
              <!-- Indicators -->
              <div class="flex items-center gap-2 mt-2">
                <span v-if="material.requiresColdStorage" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h14V7l-7-5zM10 4.5L15 8v8H5V8l5-3.5z"/>
                    <circle cx="10" cy="12" r="2"/>
                  </svg>
                  Bảo quản lạnh
                </span>
                
                <span v-if="isLowStock(material)" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <ExclamationTriangleIcon class="w-3 h-3 mr-1" />
                  Tồn kho thấp
                </span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-col gap-1 ml-4">
              <button
                @click.stop="$emit('view', material)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                title="Xem chi tiết"
              >
                <EyeIcon class="h-4 w-4" />
              </button>
              
              <button
                @click.stop="$emit('edit', material)"
                class="p-2 text-green-600 hover:bg-green-50 rounded-md"
                title="Chỉnh sửa"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              
              <button
                @click.stop="$emit('toggle-status', material)"
                :class="[
                  'p-2 rounded-md',
                  material.isActive 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-green-600 hover:bg-green-50'
                ]"
                :title="material.isActive ? 'Tạm ngừng' : 'Kích hoạt'"
              >
                <component :is="material.isActive ? XMarkIcon : CheckIcon" class="h-4 w-4" />
              </button>
              
              <button
                @click.stop="$emit('delete', material.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                title="Xóa"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop table view -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thông tin vật liệu
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phân loại
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nhà cung cấp
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tồn kho & Giá
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="material in materials" 
            :key="material.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="$emit('view', material)"
          >
            <!-- Material Info -->
            <td class="px-6 py-4">
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ material.materialName }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ material.materialCode }}
                </div>
                <div v-if="material.shortName" class="text-xs text-gray-400">
                  {{ material.shortName }}
                </div>
                
                <!-- Indicators -->
                <div class="flex items-center gap-1 mt-1">
                  <span v-if="material.requiresColdStorage" class="text-blue-500" title="Bảo quản lạnh">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11h14V7l-7-5zM10 4.5L15 8v8H5V8l5-3.5z"/>
                      <circle cx="10" cy="12" r="2"/>
                    </svg>
                  </span>
                  <span v-if="isLowStock(material)" class="text-amber-500" title="Tồn kho thấp">
                    <ExclamationTriangleIcon class="h-4 w-4" />
                  </span>
                </div>
              </div>
            </td>
            
            <!-- Classification -->
            <td class="px-6 py-4">
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getMaterialTypeClass(material.materialType)">
                  {{ getMaterialTypeLabel(material.materialType) }}
                </span>
                <div class="mt-1">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getMaterialFormClass(material.materialForm)">
                    {{ getMaterialFormLabel(material.materialForm) }}
                  </span>
                </div>
              </div>
            </td>
            
            <!-- Supplier -->
            <td class="px-6 py-4">
              <div v-if="material.supplierDto" class="text-sm">
                <div class="font-medium text-gray-900">{{ material.supplierDto.supplierName }}</div>
                <div class="text-gray-500">{{ material.supplierDto.supplierCode }}</div>
                <div class="text-gray-400">{{ material.supplierDto.countryOfOrigin }}</div>
              </div>
              <div v-else class="text-sm text-gray-400">
                Chưa có nhà cung cấp
              </div>
            </td>
            
            <!-- Stock & Price -->
            <td class="px-6 py-4">
              <div class="text-sm">
                <div class="flex items-center gap-2">
                  <span :class="getStockClass(material.currentStock, material.minimumStockLevel)">
                    {{ material.currentStock || 0 }}
                  </span>
                  <span class="text-gray-500">{{ material.unitOfMeasure }}</span>
                </div>
                <div v-if="material.fixedPrice" class="text-gray-600 mt-1">
                  {{ formatCurrency(material.fixedPrice) }}
                </div>
                <div v-if="material.minimumStockLevel" class="text-xs text-gray-400 mt-1">
                  Tối thiểu: {{ material.minimumStockLevel }} {{ material.unitOfMeasure }}
                </div>
              </div>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4">
              <span 
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  material.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ material.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </td>
            
            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click.stop="$emit('view', material)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Xem chi tiết"
                >
                  <EyeIcon class="h-4 w-4" />
                </button>
                
                <button
                  @click.stop="$emit('edit', material)"
                  class="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  title="Chỉnh sửa"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                
                <button
                  @click.stop="$emit('toggle-status', material)"
                  :class="[
                    'p-1.5 rounded-md transition-colors',
                    material.isActive 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                  ]"
                  :title="material.isActive ? 'Tạm ngừng' : 'Kích hoạt'"
                >
                  <component :is="material.isActive ? XMarkIcon : CheckIcon" class="h-4 w-4" />
                </button>
                
                <button
                  @click.stop="$emit('delete', material.id)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Xóa"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="materials.length === 0" class="text-center py-12">
      <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có vật liệu nào</h3>
      <p class="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm vật liệu mới.</p>
    </div>
  </div>
</template>

<script setup>
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  materials: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view', 'edit', 'delete', 'toggle-status'])

// Helper methods
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

const isLowStock = (material) => {
  return material.currentStock && material.minimumStockLevel && 
         material.currentStock <= material.minimumStockLevel
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
</script>
