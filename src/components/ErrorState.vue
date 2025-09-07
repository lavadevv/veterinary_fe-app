<template>
  <div class="bg-white rounded-lg shadow-sm border border-red-200 p-8">
    <div class="text-center">
      <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400" />
      
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        {{ title }}
      </h3>
      
      <div class="mt-3 max-w-md mx-auto">
        <p class="text-sm text-gray-500 mb-4">{{ message }}</p>
        
        <!-- Error details for debugging -->
        <details v-if="showDetails" class="text-left">
          <summary class="text-xs text-gray-400 cursor-pointer hover:text-gray-600 mb-2">
            Chi tiết lỗi (dành cho developer)
          </summary>
          <div class="bg-gray-50 p-3 rounded border text-xs text-gray-600 font-mono">
            <p v-if="details.id"><strong>ID:</strong> {{ details.id }}</p>
            <p v-if="details.url"><strong>URL:</strong> {{ details.url }}</p>
            <p><strong>Error:</strong> {{ message }}</p>
            <p><strong>Timestamp:</strong> {{ new Date().toISOString() }}</p>
            <p v-if="details.statusCode"><strong>Status Code:</strong> {{ details.statusCode }}</p>
          </div>
        </details>
      </div>
      
      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          v-if="showRetry"
          @click="$emit('retry')"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowPathIcon class="h-4 w-4 mr-2" />
          {{ retryText }}
        </button>
        
        <button
          v-if="showGoBack"
          @click="$emit('goBack')"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          {{ goBackText }}
        </button>
        
        <!-- Custom Actions -->
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    default: 'Có lỗi xảy ra'
  },
  message: {
    type: String,
    required: true
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  retryText: {
    type: String,
    default: 'Thử lại'
  },
  showGoBack: {
    type: Boolean,
    default: true
  },
  goBackText: {
    type: String,
    default: 'Quay lại'
  },
  showDetails: {
    type: Boolean,
    default: true
  },
  details: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['retry', 'goBack'])
</script>
