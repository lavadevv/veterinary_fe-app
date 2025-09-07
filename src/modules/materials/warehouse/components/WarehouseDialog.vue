<template>
  <TransitionRoot appear :show="visible" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-white">
                    {{ title || (isEdit ? 'Chỉnh sửa kho' : 'Thêm kho mới') }}
                  </DialogTitle>
                  <button
                    @click="handleClose"
                    class="rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Body -->
              <form @submit.prevent="handleSubmit" class="p-6">
                <div class="space-y-6 max-h-96 overflow-y-auto">
                  <!-- Basic Information -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clip-rule="evenodd" />
                      </svg>
                      Thông tin cơ bản
                    </h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Warehouse Code -->
                      <div>
                        <label for="warehouseCode" class="block text-sm font-medium text-gray-700 mb-1">
                          Mã kho <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="warehouseCode"
                          v-model="formData.warehouseCode"
                          type="text"
                          placeholder="Nhập mã kho (VD: WH001)"
                          :disabled="isEdit"
                          :class="[
                            'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                            isEdit && 'bg-gray-100 cursor-not-allowed',
                            errors.warehouseCode ? 'border-red-300' : 'border-gray-300'
                          ]"
                        />
                        <p v-if="errors.warehouseCode" class="mt-1 text-sm text-red-600">{{ errors.warehouseCode }}</p>
                      </div>

                      <!-- Warehouse Name -->
                      <div>
                        <label for="warehouseName" class="block text-sm font-medium text-gray-700 mb-1">
                          Tên kho <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="warehouseName"
                          v-model="formData.warehouseName"
                          type="text"
                          placeholder="Nhập tên kho"
                          :class="[
                            'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                            errors.warehouseName ? 'border-red-300' : 'border-gray-300'
                          ]"
                        />
                        <p v-if="errors.warehouseName" class="mt-1 text-sm text-red-600">{{ errors.warehouseName }}</p>
                      </div>

                      <!-- Warehouse Type -->
                      <div>
                        <label for="warehouseType" class="block text-sm font-medium text-gray-700 mb-1">
                          Loại kho <span class="text-red-500">*</span>
                        </label>
                        <Listbox v-model="formData.warehouseType">
                          <div class="relative">
                            <ListboxButton
                              :class="[
                                'relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                                errors.warehouseType ? 'border-red-300' : 'border-gray-300'
                              ]"
                            >
                              <span class="block truncate">
                                {{ formData.warehouseType || 'Chọn loại kho' }}
                              </span>
                              <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                              </span>
                            </ListboxButton>

                            <transition
                              leave-active-class="transition duration-100 ease-in"
                              leave-from-class="opacity-100"
                              leave-to-class="opacity-0"
                            >
                              <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                <ListboxOption
                                  v-for="type in warehouseTypes"
                                  :key="type.value"
                                  v-slot="{ active, selected }"
                                  :value="type.value"
                                  as="template"
                                >
                                  <li
                                    :class="[
                                      active ? 'text-white bg-blue-600' : 'text-gray-900',
                                      'relative py-2 pl-10 pr-4 cursor-pointer select-none'
                                    ]"
                                  >
                                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                                      {{ type.label }}
                                    </span>
                                    <span
                                      v-if="selected"
                                      :class="[
                                        active ? 'text-white' : 'text-blue-600',
                                        'absolute inset-y-0 left-0 flex items-center pl-3'
                                      ]"
                                    >
                                      <CheckIcon class="w-5 h-5" aria-hidden="true" />
                                    </span>
                                  </li>
                                </ListboxOption>
                              </ListboxOptions>
                            </transition>
                          </div>
                        </Listbox>
                        <p v-if="errors.warehouseType" class="mt-1 text-sm text-red-600">{{ errors.warehouseType }}</p>
                      </div>

                      <!-- Manager Name -->
                      <div>
                        <label for="managerName" class="block text-sm font-medium text-gray-700 mb-1">
                          Người quản lý
                        </label>
                        <input
                          id="managerName"
                          v-model="formData.managerName"
                          type="text"
                          placeholder="Tên và SĐT người quản lý"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <!-- Address -->
                    <div class="mt-4">
                      <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        id="address"
                        v-model="formData.address"
                        rows="3"
                        placeholder="Nhập địa chỉ chi tiết của kho"
                        :class="[
                          'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        ]"
                      />
                      <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
                    </div>
                  </div>

                  <!-- Storage Conditions -->
                  <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" clip-rule="evenodd" />
                      </svg>
                      Điều kiện bảo quản
                    </h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Temperature Range -->
                      <div>
                        <label for="temperatureRange" class="block text-sm font-medium text-gray-700 mb-1">
                          Khoảng nhiệt độ
                        </label>
                        <input
                          id="temperatureRange"
                          v-model="formData.temperatureRange"
                          type="text"
                          placeholder="VD: 15°C - 25°C"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <!-- Humidity Range -->
                      <div>
                        <label for="humidityRange" class="block text-sm font-medium text-gray-700 mb-1">
                          Khoảng độ ẩm
                        </label>
                        <input
                          id="humidityRange"
                          v-model="formData.humidityRange"
                          type="text"
                          placeholder="VD: 50% - 70%"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <!-- Special Conditions -->
                    <div class="mt-4">
                      <label for="specialConditions" class="block text-sm font-medium text-gray-700 mb-1">
                        Điều kiện đặc biệt
                      </label>
                      <textarea
                        id="specialConditions"
                        v-model="formData.specialConditions"
                        rows="3"
                        placeholder="Mô tả các điều kiện bảo quản đặc biệt (GSP, tránh ánh nắng, v.v.)"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                      </svg>
                      Cài đặt
                    </h4>
                    
                    <div class="flex items-center">
                      <Switch
                        v-model="formData.isActive"
                        :class="formData.isActive ? 'bg-green-600' : 'bg-gray-200'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <span
                          :class="formData.isActive ? 'translate-x-6' : 'translate-x-1'"
                          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        />
                      </Switch>
                      <span class="ml-3 text-sm text-gray-900">
                        Kho {{ formData.isActive ? 'đang hoạt động' : 'tạm dừng hoạt động' }}
                      </span>
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      Kho {{ formData.isActive ? 'có thể' : 'không thể' }} thực hiện các giao dịch nhập/xuất hàng
                    </p>
                  </div>
                </div>

                <!-- Footer -->
                <div class="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    @click="handleClose"
                    class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ loading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm mới') }}
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
import { ref, computed, watch, nextTick } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Switch
} from '@headlessui/vue'
import {
  ChevronUpDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { useWarehouseStore } from '../store/warehouseStore'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  warehouse: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['close', 'success'])

// Store
const warehouseStore = useWarehouseStore()

// State
const loading = ref(false)
const errors = ref({})

// Warehouse types
const warehouseTypes = [
  { value: 'Kho nguyên liệu', label: 'Kho nguyên liệu' },
  { value: 'Kho bao bì', label: 'Kho bao bì' },
  { value: 'Thành phẩm', label: 'Kho thành phẩm' },
  { value: 'Kho phụ liệu', label: 'Kho phụ liệu' },
  { value: 'Kho tạm', label: 'Kho tạm' }
]

// Form data
const formData = ref({
  warehouseCode: '',
  warehouseName: '',
  warehouseType: '',
  address: '',
  managerName: '',
  temperatureRange: '',
  humidityRange: '',
  specialConditions: '',
  isActive: true
})

// Computed
const isEdit = computed(() => !!props.warehouse?.id)

// Methods
const initForm = () => {
  if (props.warehouse) {
    formData.value = {
      warehouseCode: props.warehouse.warehouseCode || '',
      warehouseName: props.warehouse.warehouseName || '',
      warehouseType: props.warehouse.warehouseType || '',
      address: props.warehouse.address || '',
      managerName: props.warehouse.managerName || '',
      temperatureRange: props.warehouse.temperatureRange || '',
      humidityRange: props.warehouse.humidityRange || '',
      specialConditions: props.warehouse.specialConditions || '',
      isActive: props.warehouse.isActive !== undefined ? props.warehouse.isActive : true
    }
  } else {
    resetForm()
  }
  clearErrors()
}

const resetForm = () => {
  formData.value = {
    warehouseCode: '',
    warehouseName: '',
    warehouseType: '',
    address: '',
    managerName: '',
    temperatureRange: '',
    humidityRange: '',
    specialConditions: '',
    isActive: true
  }
}

const clearErrors = () => {
  errors.value = {}
}

const validateForm = () => {
  const newErrors = {}

  // Warehouse Code validation
  if (!formData.value.warehouseCode?.trim()) {
    newErrors.warehouseCode = 'Mã kho là bắt buộc'
  } else if (formData.value.warehouseCode.length < 2) {
    newErrors.warehouseCode = 'Mã kho phải có ít nhất 2 ký tự'
  } else if (!/^[A-Z0-9_]+$/.test(formData.value.warehouseCode)) {
    newErrors.warehouseCode = 'Mã kho chỉ được chứa chữ hoa, số và dấu gạch dưới'
  }

  // Warehouse Name validation
  if (!formData.value.warehouseName?.trim()) {
    newErrors.warehouseName = 'Tên kho là bắt buộc'
  } else if (formData.value.warehouseName.length < 3) {
    newErrors.warehouseName = 'Tên kho phải có ít nhất 3 ký tự'
  }

  // Warehouse Type validation
  if (!formData.value.warehouseType?.trim()) {
    newErrors.warehouseType = 'Loại kho là bắt buộc'
  }

  // Address validation
  if (!formData.value.address?.trim()) {
    newErrors.address = 'Địa chỉ là bắt buộc'
  } else if (formData.value.address.length < 10) {
    newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    let response
    if (isEdit.value) {
      response = await warehouseStore.updateExistingWarehouse(props.warehouse.id, formData.value)
    } else {
      response = await warehouseStore.createNewWarehouse(formData.value)
    }
    
    if (response?.success) {
      emit('success', {
        message: isEdit.value ? 'Cập nhật kho thành công!' : 'Thêm kho mới thành công!',
        type: 'success'
      })
      handleClose()
    }
  } catch (error) {
    console.error('Error saving warehouse:', error)
    
    // Handle validation errors from server
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      // Show generic error
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin kho'
      emit('success', {
        message,
        type: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  emit('close')
  nextTick(() => {
    resetForm()
    clearErrors()
  })
}

// Watchers
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initForm()
  }
})

watch(() => props.warehouse, () => {
  if (props.visible) {
    initForm()
  }
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .max-w-4xl {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
}
</style>