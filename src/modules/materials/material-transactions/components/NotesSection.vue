<template>
  <div class="bg-white rounded-lg shadow" v-if="hasNotes">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="flex items-center text-lg font-semibold text-gray-900">
        <DocumentTextIcon class="w-5 h-5 mr-2" />
        Ghi chú & Lý do
      </h2>
    </div>
    
    <div class="p-6 space-y-4">
      <div v-if="transaction.reason">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">Lý do thực hiện:</h4>
        <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{ transaction.reason }}</p>
      </div>
      
      <div v-if="transaction.notes">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">Ghi chú:</h4>
        <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{ transaction.notes }}</p>
      </div>
      
      <div v-if="transaction.materialBatchDto?.notes">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">Ghi chú lô vật tư:</h4>
        <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{ transaction.materialBatchDto.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const hasNotes = computed(() => {
  return props.transaction.notes || props.transaction.reason || props.transaction.materialBatchDto?.notes
})
</script>
