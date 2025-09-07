<template>
  <span 
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    :class="formClass"
  >
    {{ formText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getMaterialFormLabel } from '../constants/material.constants'

const props = defineProps({
  form: {
    type: String,
    required: true
  }
})

const formText = computed(() => {
  return getMaterialFormLabel(props.form)
})

const formClass = computed(() => {
  const classMap = {
    BOT: 'bg-orange-100 text-orange-800',
    LONG: 'bg-blue-100 text-blue-800',
    HAT: 'bg-green-100 text-green-800',
    VIEN: 'bg-red-100 text-red-800',
    BAO_PHIM: 'bg-purple-100 text-purple-800',
    KHAC: 'bg-gray-100 text-gray-800'
  }
  
  return classMap[props.form] || 'bg-gray-100 text-gray-800'
})
</script>
