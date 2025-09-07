<template>
  <div
    v-if="shouldShowAlert"
    :class="[
      'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
      alertClass
    ]"
  >
    <component
      :is="alertIcon"
      class="w-3 h-3 mr-1"
    />
    {{ alertText }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/20/solid'

const props = defineProps({
  expiryDate: {
    type: String,
    required: true
  },
  warningDays: {
    type: Number,
    default: 30
  }
})

const today = new Date()
const expiryDate = computed(() => new Date(props.expiryDate))

const daysUntilExpiry = computed(() => {
  const timeDiff = expiryDate.value.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
})

const isExpired = computed(() => daysUntilExpiry.value < 0)
const isNearExpiry = computed(() => 
  daysUntilExpiry.value >= 0 && daysUntilExpiry.value <= props.warningDays
)

const shouldShowAlert = computed(() => isExpired.value || isNearExpiry.value)

const alertClass = computed(() => {
  if (isExpired.value) {
    return 'bg-red-100 text-red-800'
  }
  if (isNearExpiry.value) {
    return 'bg-yellow-100 text-yellow-800'
  }
  return ''
})

const alertIcon = computed(() => {
  if (isExpired.value) {
    return XCircleIcon
  }
  if (isNearExpiry.value) {
    return ExclamationTriangleIcon
  }
  return ClockIcon
})

const alertText = computed(() => {
  if (isExpired.value) {
    const daysOverdue = Math.abs(daysUntilExpiry.value)
    return `Hết hạn ${daysOverdue} ngày`
  }
  if (isNearExpiry.value) {
    return `Còn ${daysUntilExpiry.value} ngày`
  }
  return ''
})
</script>
