<template>
  <div class="bg-white rounded-lg shadow" v-if="transaction.materialBatchDto">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Thông tin chất lượng</h2>
    </div>
    
    <div class="p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Trạng thái test</label>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTestStatusClass(transaction.materialBatchDto.testStatus)">
            {{ getTestStatusText(transaction.materialBatchDto.testStatus) }}
          </span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Báo cáo test</label>
          <span class="text-sm text-gray-900">{{ transaction.materialBatchDto.testReportNumber || 'Chưa có' }}</span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Trạng thái sử dụng</label>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getUsageStatusClass(transaction.materialBatchDto.usageStatus)">
            {{ getUsageStatusText(transaction.materialBatchDto.usageStatus) }}
          </span>
        </div>
      </div>
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

const getTestStatusClass = (status) => {
  const classes = {
    'DAT': 'bg-green-100 text-green-800',
    'CHUA_DAT': 'bg-red-100 text-red-800',
    'CHO_KET_QUA': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getUsageStatusClass = (status) => {
  const classes = {
    'SAN_SANG_SU_DUNG': 'bg-green-100 text-green-800',
    'DANG_KIEM_TRA': 'bg-yellow-100 text-yellow-800',
    'KHONG_THE_SU_DUNG': 'bg-red-100 text-red-800',
    'BI_CAM': 'bg-red-100 text-red-800',
    'HET_HAN': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getTestStatusText = (status) => {
  const statuses = {
    'DAT': 'Đạt',
    'CHUA_DAT': 'Chưa đạt',
    'CHO_KET_QUA': 'Chờ kết quả'
  }
  return statuses[status] || status || 'Chưa kiểm tra'
}

const getUsageStatusText = (status) => {
  const statuses = {
    'SAN_SANG_SU_DUNG': 'Sẵn sàng sử dụng',
    'DANG_KIEM_TRA': 'Đang kiểm tra',
    'KHONG_THE_SU_DUNG': 'Không thể sử dụng',
    'BI_CAM': 'Bị cấm',
    'HET_HAN': 'Hết hạn'
  }
  return statuses[status] || status || 'Chưa xác định'
}
</script>
