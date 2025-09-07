<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
    <!-- Enhanced Header -->
    <div class="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h3 class="text-sm font-semibold text-gray-900 truncate">
              {{ batch.batchNumber }}
            </h3>
          </div>
          <p class="text-xs text-gray-600 font-medium">
            {{ batch.materialDto?.materialName }}
          </p>
          <p class="text-xs text-gray-500">
            {{ batch.materialDto?.materialCode }}
          </p>
        </div>
        <div class="flex flex-col items-end space-y-2 ml-4">
          <StatusBadge
            type="test"
            :status="batch.testStatus"
          />
          <StatusBadge
            type="usage"
            :status="batch.usageStatus"
          />
        </div>
      </div>
    </div>

    <!-- Enhanced Content -->
    <div class="px-5 py-4">
      <!-- Material Info -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <div class="text-xs text-gray-500 mb-1 font-medium">THÔNG TIN VẬT LIỆU</div>
        <div class="text-sm font-semibold text-gray-900 mb-1">
          {{ batch.materialDto?.materialCode }} - {{ batch.materialDto?.materialName }}
        </div>
        <div class="text-xs text-gray-600 px-2 py-1 bg-white rounded-md inline-block">
          {{ getMaterialTypeLabel(batch.materialDto?.materialType) }}
        </div>
      </div>

      <!-- Enhanced Quantity Info -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-xs text-blue-600 font-medium mb-1">SỐ LƯỢNG NHẬN</div>
          <div class="text-sm font-bold text-blue-900">
            {{ formatNumber(batch.receivedQuantity) }}
          </div>
          <div class="text-xs text-blue-600">{{ batch.materialDto?.unitOfMeasure }}</div>
        </div>
        <div class="text-center p-3 rounded-lg" :class="getCurrentQuantityBgClass(batch)">
          <div class="text-xs font-medium mb-1" :class="getCurrentQuantityTextClass(batch)">SỐ LƯỢNG HIỆN TẠI</div>
          <div class="text-sm font-bold" :class="getCurrentQuantityTextClass(batch)">
            {{ formatNumber(batch.currentQuantity) }}
          </div>
          <div class="text-xs" :class="getCurrentQuantityTextClass(batch)">{{ batch.materialDto?.unitOfMeasure }}</div>
        </div>
      </div>

      <!-- Enhanced Dates Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div class="p-3 bg-green-50 rounded-lg">
          <div class="text-xs text-green-600 font-medium mb-1">NGÀY NHẬN</div>
          <div class="text-sm font-semibold text-green-900">
            {{ formatDate(batch.receivedDate) }}
          </div>
        </div>
        <div v-if="batch.expiryDate" class="p-3 rounded-lg" :class="getExpiryBgClass(batch.expiryDate)">
          <div class="text-xs font-medium mb-1" :class="getExpiryTextClass(batch.expiryDate)">NGÀY HẾT HẠN</div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold" :class="getExpiryTextClass(batch.expiryDate)">
              {{ formatDate(batch.expiryDate) }}
            </span>
            <ExpiryAlert :expiry-date="batch.expiryDate" />
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="mb-3" v-if="batch.locationDto">
        <div class="text-xs text-gray-500">Vị trí</div>
        <div class="text-sm text-gray-900">
          {{ batch.locationDto.locationCode }}
          <span v-if="batch.locationDto.warehouseDto" class="text-gray-500">
            - {{ batch.locationDto.warehouseDto.warehouseName }}
          </span>
        </div>
        <div v-if="batch.locationDto.shelf || batch.locationDto.floor" class="text-xs text-gray-500">
          <span v-if="batch.locationDto.floor">Tầng {{ batch.locationDto.floor }}</span>
          <span v-if="batch.locationDto.floor && batch.locationDto.shelf"> - </span>
          <span v-if="batch.locationDto.shelf">Kệ {{ batch.locationDto.shelf }}</span>
        </div>
      </div>

      <!-- Price -->
      <div v-if="batch.unitPrice" class="mb-3">
        <div class="text-xs text-gray-500">Đơn giá</div>
        <div class="text-sm font-medium text-gray-900">
          {{ formatCurrency(batch.unitPrice) }}
        </div>
      </div>

      <!-- Additional Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
        <div v-if="batch.internalBatchCode">
          <span class="font-medium">Mã nội bộ:</span> {{ batch.internalBatchCode }}
        </div>
        <div v-if="batch.manufacturerBatchNumber">
          <span class="font-medium">Lô NSX:</span> {{ batch.manufacturerBatchNumber }}
        </div>
        <div v-if="batch.coaNumber">
          <span class="font-medium">Số COA:</span> {{ batch.coaNumber }}
        </div>
        <div v-if="batch.testReportNumber">
          <span class="font-medium">Số báo cáo:</span> {{ batch.testReportNumber }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('view', batch)"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Xem chi tiết
          </button>
          <span class="text-gray-300">|</span>
          <button
            @click="$emit('edit', batch)"
            class="text-xs text-green-600 hover:text-green-800 font-medium"
          >
            Chỉnh sửa
          </button>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex items-center space-x-1">
          <button
            v-if="canUpdateQuantity(batch)"
            @click="$emit('update-quantity', batch)"
            class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Cập nhật số lượng"
          >
            <ScaleIcon class="w-4 h-4" />
          </button>
          <button
            v-if="canMove(batch)"
            @click="$emit('move-location', batch)"
            class="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Chuyển vị trí"
          >
            <ArrowsRightLeftIcon class="w-4 h-4" />
          </button>
          <button
            v-if="canUpdateStatus(batch)"
            @click="$emit('update-status', batch)"
            class="p-1 text-gray-400 hover:text-orange-600 transition-colors"
            title="Cập nhật trạng thái"
          >
            <CogIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ScaleIcon,
  ArrowsRightLeftIcon,
  CogIcon
} from '@heroicons/vue/24/outline'
import StatusBadge from './StatusBadge.vue'
import ExpiryAlert from './ExpiryAlert.vue'
import { MATERIAL_TYPE_LABELS, USAGE_STATUS } from '../constants'

const props = defineProps({
  batch: {
    type: Object,
    required: true
  }
})

defineEmits([
  'view',
  'edit',
  'update-quantity',
  'move-location',
  'update-status'
])

const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(value)
}

const formatCurrency = (value) => {
  if (!value) return '0 VNĐ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getMaterialTypeLabel = (type) => {
  return MATERIAL_TYPE_LABELS[type] || type
}

const getQuantityColor = (batch) => {
  const current = parseFloat(batch.currentQuantity || 0)
  const received = parseFloat(batch.receivedQuantity || 0)
  const percentage = received > 0 ? (current / received) * 100 : 0
  
  if (current <= 0) return 'text-red-600'
  if (percentage < 20) return 'text-orange-600'
  if (percentage < 50) return 'text-yellow-600'
  return 'text-gray-900'
}

// New helper functions for enhanced styling
const getCurrentQuantityBgClass = (batch) => {
  const current = parseFloat(batch.currentQuantity || 0)
  const received = parseFloat(batch.receivedQuantity || 0)
  const percentage = received > 0 ? (current / received) * 100 : 0
  
  if (current <= 0) return 'bg-red-50'
  if (percentage < 20) return 'bg-orange-50'
  if (percentage < 50) return 'bg-yellow-50'
  return 'bg-green-50'
}

const getCurrentQuantityTextClass = (batch) => {
  const current = parseFloat(batch.currentQuantity || 0)
  const received = parseFloat(batch.receivedQuantity || 0)
  const percentage = received > 0 ? (current / received) * 100 : 0
  
  if (current <= 0) return 'text-red-600'
  if (percentage < 20) return 'text-orange-600'
  if (percentage < 50) return 'text-yellow-600'
  return 'text-green-600'
}

const getExpiryBgClass = (expiryDate) => {
  if (!expiryDate) return 'bg-gray-50'
  
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'bg-red-50'
  if (diffDays <= 7) return 'bg-orange-50'
  if (diffDays <= 30) return 'bg-yellow-50'
  return 'bg-gray-50'
}

const getExpiryTextClass = (expiryDate) => {
  if (!expiryDate) return 'text-gray-600'
  
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600'
  if (diffDays <= 7) return 'text-orange-600'
  if (diffDays <= 30) return 'text-yellow-600'
  return 'text-gray-600'
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
</script>
