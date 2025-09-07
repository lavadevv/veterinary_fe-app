<template>
  <div class="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
    <div class="flex items-center justify-between">
      <button 
        class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 touch-manipulation"
        @click="$emit('goBack')"
      >
        <ArrowLeftIcon class="w-5 h-5" />
      </button>
      <div class="flex-1 text-center">
        <h1 class="text-lg font-semibold text-gray-900">Chi tiết giao dịch</h1>
        <p class="text-sm text-gray-500">#{{ transactionId }}</p>
      </div>
      <div class="relative">
        <button 
          class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 touch-manipulation"
          @click="showMenu = !showMenu"
        >
          <EllipsisVerticalIcon class="w-5 h-5" />
        </button>
        <!-- Mobile Actions Dropdown -->
        <div 
          v-if="showMenu" 
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        >
          <div class="py-1">
            <button 
              @click="$emit('edit')" 
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <PencilIcon class="w-4 h-4 mr-3" />
              Chỉnh sửa
            </button>
            <button 
              @click="$emit('delete')" 
              class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <TrashIcon class="w-4 h-4 mr-3" />
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
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

const showMenu = ref(false)
</script>
