<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusClass
    ]"
  >
    <component
      v-if="icon"
      :is="icon"
      class="w-3 h-3 mr-1"
    />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  PlayIcon,
  StopIcon,
  NoSymbolIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/20/solid'
import {
  TEST_STATUS_LABELS,
  USAGE_STATUS_LABELS
} from '../constants/materialBatchConstants'

// Status colors mapping
const TEST_STATUS_COLORS = {
  'CHUA_KIEM_NGHIEM': 'bg-gray-100 text-gray-800',
  'DANG_KIEM_NGHIEM': 'bg-blue-100 text-blue-800',
  'DAT_TIEU_CHUAN': 'bg-green-100 text-green-800',
  'DAT': 'bg-green-100 text-green-800', // API compatibility
  'KHONG_DAT_TIEU_CHUAN': 'bg-red-100 text-red-800',
  'KHONG_DAT': 'bg-red-100 text-red-800', // API compatibility
  'CAN_KIEM_NGHIEM_LAI': 'bg-yellow-100 text-yellow-800'
}

const USAGE_STATUS_COLORS = {
  'CHUA_SU_DUNG': 'bg-gray-100 text-gray-800',
  'SAN_SANG_SU_DUNG': 'bg-green-100 text-green-800',
  'DANG_SU_DUNG': 'bg-blue-100 text-blue-800',
  'DA_SU_DUNG_HET': 'bg-slate-100 text-slate-800',
  'BI_LOI': 'bg-red-100 text-red-800',
  'HET_HAN': 'bg-orange-100 text-orange-800',
  'BI_HUY': 'bg-red-100 text-red-800',
  'DA_HET': 'bg-slate-100 text-slate-800', // API compatibility
  'HONG': 'bg-red-100 text-red-800' // API compatibility
}

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: value => ['test', 'usage'].includes(value)
  },
  status: {
    type: String,
    required: true
  }
})

const label = computed(() => {
  if (props.type === 'test') {
    return TEST_STATUS_LABELS[props.status] || props.status
  }
  return USAGE_STATUS_LABELS[props.status] || props.status
})

const statusClass = computed(() => {
  if (props.type === 'test') {
    return TEST_STATUS_COLORS[props.status] || 'bg-gray-100 text-gray-800'
  }
  return USAGE_STATUS_COLORS[props.status] || 'bg-gray-100 text-gray-800'
})

const icon = computed(() => {
  if (props.type === 'test') {
    switch (props.status) {
      case 'CHUA_KIEM_NGHIEM':
        return ClockIcon
      case 'DANG_KIEM_NGHIEM':
        return ExclamationTriangleIcon
      case 'DAT_TIEU_CHUAN':
      case 'DAT':
        return CheckCircleIcon
      case 'KHONG_DAT_TIEU_CHUAN':
      case 'KHONG_DAT':
        return XCircleIcon
      case 'CAN_KIEM_NGHIEM_LAI':
        return ExclamationTriangleIcon
      default:
        return ClockIcon
    }
  } else {
    switch (props.status) {
      case 'CHUA_SU_DUNG':
        return ClockIcon
      case 'SAN_SANG_SU_DUNG':
        return ShieldCheckIcon
      case 'DANG_SU_DUNG':
        return PlayIcon
      case 'DA_SU_DUNG_HET':
      case 'DA_HET':
        return StopIcon
      case 'BI_LOI':
      case 'HONG':
        return WrenchScrewdriverIcon
      case 'HET_HAN':
        return CalendarDaysIcon
      case 'BI_HUY':
        return NoSymbolIcon
      default:
        return null
    }
  }
})
</script>
