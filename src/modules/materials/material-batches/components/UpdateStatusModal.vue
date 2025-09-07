<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <form @submit.prevent="handleSubmit">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <CogIcon class="h-6 w-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Cập nhật trạng thái lô vật liệu
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Lô: {{ batch?.batchNumber }} - {{ batch?.materialDto?.materialName }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mt-6 space-y-4">
                  <!-- Current Status -->
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-sm">
                      <span class="font-medium text-gray-700">Trạng thái hiện tại:</span>
                      <div class="mt-2 flex flex-col space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-gray-600">Kiểm nghiệm:</span>
                          <StatusBadge type="test" :status="batch?.testStatus" />
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-gray-600">Sử dụng:</span>
                          <StatusBadge type="usage" :status="batch?.usageStatus" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Status Type -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Loại trạng thái cần cập nhật <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <label class="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none">
                        <input
                          v-model="form.statusType"
                          type="radio"
                          value="test"
                          class="sr-only"
                        />
                        <span class="flex flex-1">
                          <span class="flex flex-col">
                            <span :class="[
                              'block text-sm font-medium',
                              form.statusType === 'test' ? 'text-blue-900' : 'text-gray-900'
                            ]">
                              Trạng thái kiểm nghiệm
                            </span>
                            <span :class="[
                              'mt-1 flex items-center text-sm',
                              form.statusType === 'test' ? 'text-blue-700' : 'text-gray-500'
                            ]">
                              Cập nhật kết quả kiểm nghiệm
                            </span>
                          </span>
                        </span>
                        <CheckCircleIcon
                          :class="[
                            'h-5 w-5',
                            form.statusType === 'test' ? 'text-blue-600' : 'text-transparent'
                          ]"
                        />
                        <span
                          :class="[
                            'pointer-events-none absolute -inset-px rounded-lg border-2',
                            form.statusType === 'test' ? 'border-blue-500' : 'border-transparent'
                          ]"
                        />
                      </label>

                      <label class="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none">
                        <input
                          v-model="form.statusType"
                          type="radio"
                          value="usage"
                          class="sr-only"
                        />
                        <span class="flex flex-1">
                          <span class="flex flex-col">
                            <span :class="[
                              'block text-sm font-medium',
                              form.statusType === 'usage' ? 'text-blue-900' : 'text-gray-900'
                            ]">
                              Trạng thái sử dụng
                            </span>
                            <span :class="[
                              'mt-1 flex items-center text-sm',
                              form.statusType === 'usage' ? 'text-blue-700' : 'text-gray-500'
                            ]">
                              Cập nhật trạng thái sử dụng
                            </span>
                          </span>
                        </span>
                        <CheckCircleIcon
                          :class="[
                            'h-5 w-5',
                            form.statusType === 'usage' ? 'text-blue-600' : 'text-transparent'
                          ]"
                        />
                        <span
                          :class="[
                            'pointer-events-none absolute -inset-px rounded-lg border-2',
                            form.statusType === 'usage' ? 'border-blue-500' : 'border-transparent'
                          ]"
                        />
                      </label>
                    </div>
                    <p v-if="errors.statusType" class="mt-1 text-sm text-red-600">
                      {{ errors.statusType }}
                    </p>
                  </div>

                  <!-- New Status -->
                  <div v-if="form.statusType">
                    <label class="block text-sm font-medium text-gray-700">
                      {{ form.statusType === 'test' ? 'Trạng thái kiểm nghiệm mới' : 'Trạng thái sử dụng mới' }}
                      <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1">
                      <Listbox v-model="form.newStatus">
                        <div class="relative">
                          <ListboxButton 
                            class="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                            :class="{ 
                              'border-red-300 focus:border-red-500 focus:ring-red-500': errors.newStatus 
                            }"
                          >
                            <span class="block truncate">
                              {{ selectedStatusLabel || 'Chọn trạng thái mới' }}
                            </span>
                            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </ListboxButton>

                          <transition
                            leave-active-class="transition ease-in duration-100"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                          >
                            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              <ListboxOption
                                v-for="(label, status) in availableStatuses"
                                :key="status"
                                v-slot="{ active, selected }"
                                :value="status"
                                as="template"
                              >
                                <li
                                  :class="[
                                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                                    'relative cursor-pointer select-none py-2 pl-3 pr-9'
                                  ]"
                                >
                                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                                    {{ label }}
                                  </span>

                                  <span
                                    v-if="selected"
                                    :class="[
                                      active ? 'text-white' : 'text-blue-600',
                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                    ]"
                                  >
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                  </span>
                                </li>
                              </ListboxOption>
                            </ListboxOptions>
                          </transition>
                        </div>
                      </Listbox>
                    </div>
                    <p v-if="errors.newStatus" class="mt-1 text-sm text-red-600">
                      {{ errors.newStatus }}
                    </p>
                  </div>

                  <!-- Notes -->
                  <div v-if="form.statusType">
                    <label for="notes" class="block text-sm font-medium text-gray-700">
                      Ghi chú
                      <span v-if="form.statusType === 'test' && (form.newStatus === 'KHONG_DAT' || form.newStatus === 'DANG_CACH_LY')" class="text-red-500">*</span>
                    </label>
                    <div class="mt-1">
                      <textarea
                        id="notes"
                        v-model="form.notes"
                        rows="3"
                        :required="form.statusType === 'test' && (form.newStatus === 'KHONG_DAT' || form.newStatus === 'DANG_CACH_LY')"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        :class="{ 
                          'border-red-300 focus:border-red-500 focus:ring-red-500': errors.notes 
                        }"
                        :placeholder="getNotesPlaceholder()"
                      />
                    </div>
                    <p v-if="errors.notes" class="mt-1 text-sm text-red-600">
                      {{ errors.notes }}
                    </p>
                  </div>
                </div>

                <div class="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="loading" class="flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                    <span v-else>Cập nhật trạng thái</span>
                  </button>
                  <button
                    type="button"
                    @click="$emit('close')"
                    :disabled="loading"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import {
  CogIcon,
  ChevronUpDownIcon,
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import StatusBadge from './StatusBadge.vue'
import {
  TEST_STATUS_LABELS,
  USAGE_STATUS_LABELS
} from '../constants'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  batch: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const form = ref({
  statusType: 'test', // 'test' or 'usage'
  newStatus: null,
  notes: ''
})
const errors = ref({})

const availableStatuses = computed(() => {
  if (form.value.statusType === 'test') {
    // Exclude current test status
    const current = props.batch?.testStatus
    const statuses = { ...TEST_STATUS_LABELS }
    if (current) {
      delete statuses[current]
    }
    return statuses
  } else {
    // Exclude current usage status
    const current = props.batch?.usageStatus
    const statuses = { ...USAGE_STATUS_LABELS }
    if (current) {
      delete statuses[current]
    }
    return statuses
  }
})

const selectedStatusLabel = computed(() => {
  if (!form.value.newStatus) return null
  
  if (form.value.statusType === 'test') {
    return TEST_STATUS_LABELS[form.value.newStatus]
  } else {
    return USAGE_STATUS_LABELS[form.value.newStatus]
  }
})

const getNotesPlaceholder = () => {
  if (form.value.statusType === 'test') {
    if (form.value.newStatus === 'KHONG_DAT') {
      return 'Nhập lý do không đạt kiểm nghiệm...'
    } else if (form.value.newStatus === 'DANG_CACH_LY') {
      return 'Nhập lý do cách ly...'
    } else if (form.value.newStatus === 'DAT') {
      return 'Nhập kết quả kiểm nghiệm (tùy chọn)...'
    }
    return 'Nhập ghi chú về kiểm nghiệm...'
  } else {
    if (form.value.newStatus === 'BI_CAM') {
      return 'Nhập lý do bị cấm sử dụng...'
    } else if (form.value.newStatus === 'HONG') {
      return 'Nhập mô tả tình trạng hỏng...'
    } else if (form.value.newStatus === 'HET_HAN') {
      return 'Ghi chú về việc hết hạn...'
    }
    return 'Nhập ghi chú về trạng thái sử dụng...'
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.statusType) {
    errors.value.statusType = 'Vui lòng chọn loại trạng thái'
  }
  
  if (!form.value.newStatus) {
    errors.value.newStatus = 'Vui lòng chọn trạng thái mới'
  } else {
    // Check if new status is same as current
    const currentStatus = form.value.statusType === 'test' 
      ? props.batch?.testStatus 
      : props.batch?.usageStatus
      
    if (form.value.newStatus === currentStatus) {
      errors.value.newStatus = 'Trạng thái mới phải khác với trạng thái hiện tại'
    }
  }
  
  // Notes are required for certain statuses
  const requiresNotes = form.value.statusType === 'test' && 
    (form.value.newStatus === 'KHONG_DAT' || form.value.newStatus === 'DANG_CACH_LY')
    
  if (requiresNotes && !form.value.notes.trim()) {
    errors.value.notes = 'Ghi chú là bắt buộc cho trạng thái này'
  } else if (form.value.notes.trim() && form.value.notes.trim().length < 5) {
    errors.value.notes = 'Ghi chú phải có ít nhất 5 ký tự'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const data = {
      type: form.value.statusType,
      [form.value.statusType === 'test' ? 'testStatus' : 'usageStatus']: form.value.newStatus,
      notes: form.value.notes.trim() || undefined
    }
    
    await emit('save', data)
  } catch (error) {
    console.error('Error updating status:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    statusType: 'test',
    newStatus: null,
    notes: ''
  }
  errors.value = {}
}

// Watch status type change to reset new status
watch(() => form.value.statusType, () => {
  form.value.newStatus = null
  form.value.notes = ''
  delete errors.value.newStatus
  delete errors.value.notes
})

// Reset form when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})
</script>
