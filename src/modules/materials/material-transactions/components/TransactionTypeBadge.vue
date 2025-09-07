<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
      typeConfig.bg,
      typeConfig.text,
      typeConfig.ring
    ]"
  >
    <component
      :is="iconComponent"
      :class="['w-3 h-3 mr-1', typeConfig.icon]"
      v-if="showIcon"
    />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_ICONS
} from '../constants/transaction-types'

// Hero Icons
import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => Object.values(TRANSACTION_TYPES).includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const iconComponents = {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
}

const typeConfig = computed(() => {
  return TRANSACTION_TYPE_COLORS[props.type] || TRANSACTION_TYPE_COLORS[TRANSACTION_TYPES.IMPORT]
})

const label = computed(() => {
  return TRANSACTION_TYPE_LABELS[props.type] || props.type
})

const iconComponent = computed(() => {
  const iconName = TRANSACTION_TYPE_ICONS[props.type]
  return iconComponents[iconName] || ArrowDownOnSquareIcon
})
</script>
