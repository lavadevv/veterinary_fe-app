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
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <ScaleIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Cập nhật số lượng lô vật liệu
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Lô: {{ batch?.batchNumber }} - {{ batch?.materialDto?.materialName }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mt-6 space-y-4">
                  <!-- Current Info -->
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="font-medium text-gray-700">Số lượng hiện tại:</span>
                        <div class="text-gray-900">
                          {{ formatNumber(batch?.currentQuantity) }} {{ batch?.materialDto?.unitOfMeasure }}
                        </div>
                      </div>
                      <div>
                        <span class="font-medium text-gray-700">Số lượng nhận:</span>
                        <div class="text-gray-900">
                          {{ formatNumber(batch?.receivedQuantity) }} {{ batch?.materialDto?.unitOfMeasure }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- New Quantity -->
                  <div>
                    <label for="newQuantity" class="block text-sm font-medium text-gray-700">
                      Số lượng mới <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1 relative">
                      <input
                        id="newQuantity"
                        v-model="form.newQuantity"
                        type="number"
                        step="0.001"
                        min="0"
                        :max="batch?.receivedQuantity"
                        required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        :class="{ 
                          'border-red-300 focus:border-red-500 focus:ring-red-500': errors.newQuantity 
                        }"
                      />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">{{ batch?.materialDto?.unitOfMeasure }}</span>
                      </div>
                    </div>
                    <p v-if="errors.newQuantity" class="mt-1 text-sm text-red-600">
                      {{ errors.newQuantity }}
                    </p>
                  </div>

                  <!-- Change Amount -->
                  <div v-if="form.newQuantity !== null && form.newQuantity !== ''">
                    <label class="block text-sm font-medium text-gray-700">
                      Thay đổi
                    </label>
                    <div class="mt-1 text-sm">
                      <span :class="changeAmountClass">
                        {{ changeAmountText }}
                      </span>
                    </div>
                  </div>

                  <!-- Reason -->
                  <div>
                    <label for="reason" class="block text-sm font-medium text-gray-700">
                      Lý do thay đổi <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1">
                      <textarea
                        id="reason"
                        v-model="form.reason"
                        rows="3"
                        required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        :class="{ 
                          'border-red-300 focus:border-red-500 focus:ring-red-500': errors.reason 
                        }"
                        placeholder="Nhập lý do thay đổi số lượng..."
                      />
                    </div>
                    <p v-if="errors.reason" class="mt-1 text-sm text-red-600">
                      {{ errors.reason }}
                    </p>
                  </div>
                </div>

                <div class="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="loading" class="flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                    <span v-else>Cập nhật</span>
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
  TransitionRoot
} from '@headlessui/vue'
import { ScaleIcon } from '@heroicons/vue/24/outline'

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
  newQuantity: null,
  reason: ''
})
const errors = ref({})

const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(value)
}

const changeAmount = computed(() => {
  if (form.value.newQuantity === null || form.value.newQuantity === '' || !props.batch) {
    return 0
  }
  return parseFloat(form.value.newQuantity) - parseFloat(props.batch.currentQuantity || 0)
})

const changeAmountText = computed(() => {
  const amount = Math.abs(changeAmount.value)
  const unit = props.batch?.materialDto?.unitOfMeasure || ''
  
  if (changeAmount.value > 0) {
    return `+${formatNumber(amount)} ${unit} (Tăng)`
  } else if (changeAmount.value < 0) {
    return `-${formatNumber(amount)} ${unit} (Giảm)`
  }
  return `Không thay đổi`
})

const changeAmountClass = computed(() => {
  if (changeAmount.value > 0) {
    return 'text-green-600 font-medium'
  } else if (changeAmount.value < 0) {
    return 'text-red-600 font-medium'
  }
  return 'text-gray-600'
})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.newQuantity && form.value.newQuantity !== 0) {
    errors.value.newQuantity = 'Số lượng mới không được để trống'
  } else if (parseFloat(form.value.newQuantity) < 0) {
    errors.value.newQuantity = 'Số lượng không được âm'
  } else if (parseFloat(form.value.newQuantity) > parseFloat(props.batch?.receivedQuantity || 0)) {
    errors.value.newQuantity = 'Số lượng không được vượt quá số lượng nhận'
  }
  
  if (!form.value.reason.trim()) {
    errors.value.reason = 'Lý do thay đổi không được để trống'
  } else if (form.value.reason.trim().length < 10) {
    errors.value.reason = 'Lý do thay đổi phải có ít nhất 10 ký tự'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  if (changeAmount.value === 0) {
    errors.value.newQuantity = 'Số lượng mới phải khác với số lượng hiện tại'
    return
  }
  
  loading.value = true
  
  try {
    const data = {
      newQuantity: parseFloat(form.value.newQuantity),
      reason: form.value.reason.trim()
    }
    
    await emit('save', data)
  } catch (error) {
    console.error('Error updating quantity:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    newQuantity: null,
    reason: ''
  }
  errors.value = {}
}

// Watch for batch changes to update form
watch(() => props.batch, (newBatch) => {
  if (newBatch) {
    form.value.newQuantity = parseFloat(newBatch.currentQuantity || 0)
  }
}, { immediate: true })

// Reset form when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})
</script>
