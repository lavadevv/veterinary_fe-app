<template>
  <span 
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    :class="statusClass"
  >
    <span 
      class="w-1.5 h-1.5 rounded-full mr-1.5"
      :class="dotClass"
    ></span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true
  }
})

const statusClass = computed(() => {
  return props.isActive 
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
})

const dotClass = computed(() => {
  return props.isActive 
    ? 'bg-green-500'
    : 'bg-red-500'
})

const statusText = computed(() => {
  return props.isActive ? 'Hoạt động' : 'Ngừng hoạt động'
})
</script>
