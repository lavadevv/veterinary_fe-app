<template>
  <div class="space-y-4">
    <!-- Bulk Actions Bar -->
    <div 
      v-if="selectedItems.length > 0"
      class="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-blue-900">
            Đã chọn {{ selectedItems.length }} vật liệu
          </span>
          <button
            @click="selectAll"
            v-if="selectedItems.length < materials.length"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Chọn tất cả
          </button>
          <button
            @click="clearSelection"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Bỏ chọn
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('bulk-toggle-status', selectedItems)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          >
            <ArrowPathIcon class="h-4 w-4 mr-1.5" />
            Đổi trạng thái
          </button>
          <button
            @click="$emit('bulk-delete', selectedItems)"
            class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
          >
            <TrashIcon class="h-4 w-4 mr-1.5" />
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Materials List -->
    <div class="space-y-3">
      <MaterialCard
        v-for="material in materials"
        :key="material.id"
        :material="material"
        :is-selected="selectedItems.includes(material.id)"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @toggle-selection="toggleSelection"
      />
    </div>

    <!-- Empty State -->
    <div 
      v-if="materials.length === 0 && !loading"
      class="text-center py-12"
    >
      <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ hasFilters ? 'Không tìm thấy vật liệu' : 'Chưa có vật liệu nào' }}
      </h3>
      <p class="text-sm text-gray-500 mb-6">
        {{ hasFilters 
          ? 'Thử thay đổi bộ lọc để tìm thấy vật liệu phù hợp' 
          : 'Hãy tạo vật liệu đầu tiên để bắt đầu quản lý kho' 
        }}
      </p>
      <button
        v-if="hasFilters"
        @click="$emit('clear-filters')"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
      >
        Xóa bộ lọc
      </button>
      <button
        v-else
        @click="$emit('create')"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
      >
        <PlusIcon class="h-4 w-4 mr-1.5" />
        Tạo vật liệu đầu tiên
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div 
        v-for="i in 5" 
        :key="i"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
      >
        <div class="flex items-center space-x-4">
          <div class="w-5 h-5 bg-gray-200 rounded"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div class="flex space-x-2">
            <div class="w-16 h-6 bg-gray-200 rounded"></div>
            <div class="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  TrashIcon,
  ArrowPathIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import MaterialCard from './MaterialCard.vue'

const props = defineProps({
  materials: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasFilters: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'view', 
  'edit', 
  'delete', 
  'create',
  'bulk-delete', 
  'bulk-toggle-status',
  'clear-filters'
])

// Selection state
const selectedItems = ref([])

// Methods
const toggleSelection = (materialId) => {
  const index = selectedItems.value.indexOf(materialId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(materialId)
  }
}

const selectAll = () => {
  selectedItems.value = props.materials.map(material => material.id)
}

const clearSelection = () => {
  selectedItems.value = []
}

// Watch for materials change to clear invalid selections
const validSelectedItems = computed(() => {
  const materialIds = props.materials.map(material => material.id)
  return selectedItems.value.filter(id => materialIds.includes(id))
})

// Update selectedItems when materials change
selectedItems.value = validSelectedItems.value
</script>
