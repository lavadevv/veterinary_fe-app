<template>
  <div class="text-right">
    <div class="flex items-center justify-end space-x-1">
      <span 
        class="text-sm font-medium"
        :class="stockClass"
      >
        {{ formattedCurrent }}
      </span>
      <span class="text-xs text-gray-400">{{ unit }}</span>
    </div>
    <div class="text-xs text-gray-500 mt-0.5">
      Tối thiểu: {{ formattedMinimum }} {{ unit }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  minimum: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
})

const isLowStock = computed(() => {
  return props.current <= props.minimum
})

const stockClass = computed(() => {
  if (isLowStock.value) {
    return 'text-red-600'
  } else if (props.current <= props.minimum * 1.2) {
    return 'text-amber-600'
  }
  return 'text-green-600'
})

const formattedCurrent = computed(() => {
  return new Intl.NumberFormat('vi-VN').format(props.current)
})

const formattedMinimum = computed(() => {
  return new Intl.NumberFormat('vi-VN').format(props.minimum)
})
</script>
