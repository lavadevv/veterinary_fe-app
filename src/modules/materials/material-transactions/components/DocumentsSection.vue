<template>
  <div class="bg-white rounded-lg shadow" v-if="hasDocuments">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Tài liệu kèm theo</h2>
    </div>
    
    <div class="p-6">
      <div class="space-y-4">
        <div v-if="transaction.materialBatchDto?.coaNumber" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <DocumentTextIcon class="w-5 h-5 text-gray-400" />
          <div>
            <div class="text-sm font-medium text-gray-900">Certificate of Analysis (COA)</div>
            <div class="text-sm text-gray-500">{{ transaction.materialBatchDto.coaNumber }}</div>
          </div>
        </div>
        
        <div v-if="transaction.materialBatchDto?.msdsFilePath" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <DocumentIcon class="w-5 h-5 text-gray-400" />
          <div>
            <div class="text-sm font-medium text-gray-900">Material Safety Data Sheet</div>
            <div class="text-sm text-gray-500">{{ transaction.materialBatchDto.msdsFilePath }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  DocumentTextIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const hasDocuments = computed(() => {
  return props.transaction.materialBatchDto?.coaNumber || props.transaction.materialBatchDto?.msdsFilePath
})
</script>
