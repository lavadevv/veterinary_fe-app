<template>
  <div class="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          @click="$emit('goBack')"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <span>Quản lý vật tư</span>
          <ChevronRightIcon class="w-4 h-4" />
          <span>Giao dịch</span>
          <ChevronRightIcon class="w-4 h-4" />
          <span class="text-gray-900 font-medium">Chi tiết #{{ transactionId }}</span>
        </nav>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
          @click="$emit('edit')"
        >
          <PencilIcon class="w-4 h-4 mr-2" />
          Chỉnh sửa
        </button>
        <button 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" 
          @click="$emit('delete')"
        >
          <TrashIcon class="w-4 h-4 mr-2" />
          Xóa
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

defineProps({
  transactionId: {
    type: [String, Number],
    required: true
  }
})

defineEmits(['goBack', 'edit', 'delete'])
</script>
