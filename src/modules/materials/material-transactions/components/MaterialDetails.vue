<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Thông tin vật tư</h2>
    </div>
    
    <div class="p-6" v-if="transaction.materialBatchDto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Tên vật tư</label>
          <span class="text-sm font-medium text-gray-900">
            {{ transaction.materialBatchDto.materialDto?.materialName || 'N/A' }}
          </span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Số lô</label>
          <span class="text-sm font-medium text-gray-900">
            {{ transaction.materialBatchDto.batchNumber || 'N/A' }}
          </span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Hạn sử dụng</label>
          <span class="text-sm font-medium" :class="getExpiryClass(transaction.materialBatchDto.expiryDate)">
            {{ formatDate(transaction.materialBatchDto.expiryDate) }}
          </span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Nhà cung cấp</label>
          <span class="text-sm font-medium text-gray-900">
            {{ transaction.materialBatchDto.supplierDto?.supplierName || 'N/A' }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="p-6">
      <p class="text-gray-500 text-center">Không có thông tin vật tư</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getExpiryClass = (expiryDate) => {
  if (!expiryDate) return 'text-gray-500'
  const expiry = new Date(expiryDate)
  const now = new Date()
  const daysDiff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysDiff < 0) return 'text-red-600'
  if (daysDiff < 30) return 'text-yellow-600'
  return 'text-green-600'
}
</script>
