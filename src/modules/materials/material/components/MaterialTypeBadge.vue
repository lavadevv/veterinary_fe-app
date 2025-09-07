<template>
  <span 
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    :class="typeClass"
  >
    {{ typeText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getMaterialTypeLabel } from '../constants/material.constants'

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const typeText = computed(() => {
  return getMaterialTypeLabel(props.type)
})

const typeClass = computed(() => {
  const classMap = {
    NGUYEN_LIEU: 'bg-blue-100 text-blue-800',
    PHU_LIEU: 'bg-purple-100 text-purple-800',
    BAO_BI: 'bg-yellow-100 text-yellow-800',
    VAT_TU_TIEU_HAO: 'bg-pink-100 text-pink-800',
    DUNG_MOI: 'bg-indigo-100 text-indigo-800',
    KHAC: 'bg-gray-100 text-gray-800'
  }
  
  return classMap[props.type] || 'bg-gray-100 text-gray-800'
})
</script>
