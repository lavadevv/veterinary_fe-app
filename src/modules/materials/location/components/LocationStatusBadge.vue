<!-- LocationStatusBadge.vue - Component hiển thị trạng thái location -->
<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200',
      statusClasses
    ]"
  >
    <span
      :class="[
        'w-1.5 h-1.5 rounded-full mr-1.5',
        dotClasses
      ]"
    ></span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  status: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md'].includes(value)
  }
})

// Computed
const statusText = computed(() => {
  return props.status ? 'Khả dụng' : 'Không khả dụng'
})

const statusClasses = computed(() => {
  const baseClasses = props.status
    ? 'bg-green-100 text-green-800 border border-green-200'
    : 'bg-red-100 text-red-800 border border-red-200'
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]}`
})

const dotClasses = computed(() => {
  return props.status ? 'bg-green-500' : 'bg-red-500'
})
</script>
