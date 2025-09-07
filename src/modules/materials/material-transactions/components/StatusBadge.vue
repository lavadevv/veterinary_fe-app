<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
      statusConfig.bg,
      statusConfig.text,
      statusConfig.ring
    ]"
  >
    <component
      :is="iconComponent"
      :class="['w-3 h-3 mr-1', statusConfig.icon]"
      v-if="showIcon"
    />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import {
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_COLORS,
  TRANSACTION_STATUS_ICONS
} from '../constants/transaction-types'

// Hero Icons
import {
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  CheckBadgeIcon,
  NoSymbolIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => Object.values(TRANSACTION_STATUSES).includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const iconComponents = {
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  CheckBadgeIcon,
  NoSymbolIcon
}

const statusConfig = computed(() => {
  return TRANSACTION_STATUS_COLORS[props.status] || TRANSACTION_STATUS_COLORS[TRANSACTION_STATUSES.PENDING]
})

const label = computed(() => {
  return TRANSACTION_STATUS_LABELS[props.status] || props.status
})

const iconComponent = computed(() => {
  const iconName = TRANSACTION_STATUS_ICONS[props.status]
  return iconComponents[iconName] || ClockIcon
})
</script>
