<!-- LocationForm.vue - Form tạo/chỉnh sửa location -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Warehouse Selection -->
    <div>
      <label for="warehouseId" class="block text-sm font-medium text-gray-700 mb-2">
        Kho <span class="text-red-500">*</span>
      </label>
      <Listbox v-model="formData.warehouseId">
        <div class="relative">
          <ListboxButton
            :class="[
              'relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-sm border transition-colors duration-200',
              errors.warehouseId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
              'focus:outline-none focus:ring-1 sm:text-sm'
            ]"
          >
            <span v-if="selectedWarehouse" class="block truncate text-gray-900">
              {{ selectedWarehouse.warehouseCode }} - {{ selectedWarehouse.warehouseName }}
            </span>
            <span v-else class="block truncate text-gray-400">
              Chọn kho...
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-for="warehouse in warehouses"
                :key="warehouse.id"
                :value="warehouse.id"
                v-slot="{ active, selected }"
                as="template"
              >
                <li :class="[active ? 'bg-blue-600 text-white' : 'text-gray-900', 'relative cursor-pointer select-none py-2 pl-10 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                    {{ warehouse.warehouseCode }} - {{ warehouse.warehouseName }}
                  </span>
                  <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 left-0 flex items-center pl-3']">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
      <p v-if="errors.warehouseId" class="mt-1 text-sm text-red-600">{{ errors.warehouseId }}</p>
    </div>

    <!-- Location Code -->
    <div>
      <label for="locationCode" class="block text-sm font-medium text-gray-700 mb-2">
        Mã vị trí <span class="text-red-500">*</span>
      </label>
      <input
        id="locationCode"
        v-model="formData.locationCode"
        type="text"
        maxlength="50"
        :class="[
          'block w-full rounded-lg border px-3 py-3 shadow-sm transition-colors duration-200 sm:text-sm',
          errors.locationCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          'focus:outline-none focus:ring-1'
        ]"
        placeholder="Nhập mã vị trí (tối đa 50 ký tự)"
      />
      <p v-if="errors.locationCode" class="mt-1 text-sm text-red-600">{{ errors.locationCode }}</p>
    </div>

    <!-- Grid layout for Shelf and Floor -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Shelf -->
      <div>
        <label for="shelf" class="block text-sm font-medium text-gray-700 mb-2">
          Kệ
        </label>
        <input
          id="shelf"
          v-model="formData.shelf"
          type="text"
          maxlength="50"
          :class="[
            'block w-full rounded-lg border px-3 py-3 shadow-sm transition-colors duration-200 sm:text-sm',
            errors.shelf ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            'focus:outline-none focus:ring-1'
          ]"
          placeholder="Thông tin kệ"
        />
        <p v-if="errors.shelf" class="mt-1 text-sm text-red-600">{{ errors.shelf }}</p>
      </div>

      <!-- Floor -->
      <div>
        <label for="floor" class="block text-sm font-medium text-gray-700 mb-2">
          Tầng
        </label>
        <input
          id="floor"
          v-model="formData.floor"
          type="text"
          maxlength="50"
          :class="[
            'block w-full rounded-lg border px-3 py-3 shadow-sm transition-colors duration-200 sm:text-sm',
            errors.floor ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            'focus:outline-none focus:ring-1'
          ]"
          placeholder="Thông tin tầng"
        />
        <p v-if="errors.floor" class="mt-1 text-sm text-red-600">{{ errors.floor }}</p>
      </div>
    </div>

    <!-- Position Detail -->
    <div>
      <label for="positionDetail" class="block text-sm font-medium text-gray-700 mb-2">
        Chi tiết vị trí
      </label>
      <textarea
        id="positionDetail"
        v-model="formData.positionDetail"
        rows="3"
        maxlength="255"
        :class="[
          'block w-full rounded-lg border px-3 py-3 shadow-sm transition-colors duration-200 sm:text-sm resize-none',
          errors.positionDetail ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          'focus:outline-none focus:ring-1'
        ]"
        placeholder="Mô tả chi tiết về vị trí kho (tối đa 255 ký tự)"
      ></textarea>
      <div class="mt-1 flex justify-between">
        <p v-if="errors.positionDetail" class="text-sm text-red-600">{{ errors.positionDetail }}</p>
        <p class="text-xs text-gray-500 ml-auto">{{ (formData.positionDetail || '').length }}/255</p>
      </div>
    </div>

    <!-- Capacity Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Max Capacity -->
      <div>
        <label for="maxCapacity" class="block text-sm font-medium text-gray-700 mb-2">
          Sức chứa tối đa <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="maxCapacity"
            v-model.number="formData.maxCapacity"
            type="number"
            min="0.1"
            step="0.1"
            :class="[
              'block w-full rounded-lg border px-3 py-3 shadow-sm transition-colors duration-200 sm:text-sm',
              errors.maxCapacity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
              'focus:outline-none focus:ring-1'
            ]"
            placeholder="0.0"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-gray-500 text-sm">đơn vị</span>
          </div>
        </div>
        <p v-if="errors.maxCapacity" class="mt-1 text-sm text-red-600">{{ errors.maxCapacity }}</p>
      </div>

      <!-- Current Capacity -->
      <div>
        <label for="currentCapacity" class="block text-sm font-medium text-gray-700 mb-2">
          Sức chứa hiện tại
        </label>
        <div class="relative">
          <input
            id="currentCapacity"
            v-model.number="formData.currentCapacity"
            type="number"
            min="0"
            step="0.1"
            :class="[
              'block w-full rounded-lg border px-3 py-3 shadow-sm transition-colors duration-200 sm:text-sm',
              errors.currentCapacity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
              'focus:outline-none focus:ring-1'
            ]"
            placeholder="0.0"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-gray-500 text-sm">đơn vị</span>
          </div>
        </div>
        <p v-if="errors.currentCapacity" class="mt-1 text-sm text-red-600">{{ errors.currentCapacity }}</p>
      </div>
    </div>

    <!-- Capacity Validation Warning -->
    <div v-if="capacityWarning" class="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 mr-2" />
        <p class="text-sm text-yellow-800">{{ capacityWarning }}</p>
      </div>
    </div>

    <!-- Available Status (for edit mode) -->
    <div v-if="isEdit">
      <label class="flex items-center">
        <input
          v-model="formData.isAvailable"
          type="checkbox"
          class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span class="ml-2 text-sm font-medium text-gray-700">Vị trí khả dụng</span>
      </label>
      <p class="mt-1 text-xs text-gray-500">
        Bỏ tick để tạm dừng sử dụng vị trí này
      </p>
    </div>

    <!-- Submit Buttons -->
    <div class="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-gray-200">
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        :class="[
          'w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg transition-all duration-200',
          loading || !isFormValid
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02]'
        ]"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo mới') }}
      </button>

      <button
        type="button"
        @click="emit('cancel')"
        class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        Hủy
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  warehouses: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Form data
const formData = ref({
  warehouseId: null,
  locationCode: '',
  shelf: '',
  floor: '',
  positionDetail: '',
  maxCapacity: null,
  currentCapacity: 0,
  isAvailable: true
})

// Initialize form data with proper warehouse ID mapping
const initializeFormData = () => {
  const initialData = props.initialData || {}
  
  // Map warehouse ID correctly
  let warehouseId = null
  if (initialData.warehouseId) {
    warehouseId = initialData.warehouseId
  } else if (initialData.warehouse?.id) {
    warehouseId = initialData.warehouse.id
  }
  
  formData.value = {
    warehouseId,
    locationCode: initialData.locationCode || '',
    shelf: initialData.shelf || '',
    floor: initialData.floor || '',
    positionDetail: initialData.positionDetail || '',
    maxCapacity: initialData.maxCapacity || null,
    currentCapacity: initialData.currentCapacity || 0,
    isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true
  }
  
  console.log('🔧 Form initialized with data:', formData.value)
  console.log('🔧 Available warehouses:', props.warehouses)
}

// Errors
const errors = ref({})

// Computed
const selectedWarehouse = computed(() => {
  const selected = props.warehouses.find(w => w.id === formData.value.warehouseId)
  console.log('🔧 Looking for warehouse ID:', formData.value.warehouseId)
  console.log('🔧 Selected warehouse:', selected)
  return selected
})

const capacityWarning = computed(() => {
  if (!formData.value.maxCapacity || !formData.value.currentCapacity) return null
  
  if (formData.value.currentCapacity > formData.value.maxCapacity) {
    return 'Sức chứa hiện tại vượt quá sức chứa tối đa!'
  }
  
  const utilizationRate = (formData.value.currentCapacity / formData.value.maxCapacity) * 100
  if (utilizationRate >= 90) {
    return 'Vị trí sắp đầy (sử dụng >= 90%)'
  }
  
  return null
})

const isFormValid = computed(() => {
  return (
    formData.value.warehouseId &&
    formData.value.locationCode?.trim() &&
    formData.value.maxCapacity > 0 &&
    formData.value.currentCapacity >= 0 &&
    Object.keys(errors.value).length === 0
  )
})

// Validation methods
const validateField = (field, value) => {
  switch (field) {
    case 'warehouseId':
      if (!value) {
        errors.value.warehouseId = 'Vui lòng chọn kho'
      } else {
        delete errors.value.warehouseId
      }
      break

    case 'locationCode':
      if (!value?.trim()) {
        errors.value.locationCode = 'Mã vị trí không được để trống'
      } else if (value.length > 50) {
        errors.value.locationCode = 'Mã vị trí không được vượt quá 50 ký tự'
      } else {
        delete errors.value.locationCode
      }
      break

    case 'shelf':
      if (value && value.length > 50) {
        errors.value.shelf = 'Thông tin kệ không được vượt quá 50 ký tự'
      } else {
        delete errors.value.shelf
      }
      break

    case 'floor':
      if (value && value.length > 50) {
        errors.value.floor = 'Thông tin tầng không được vượt quá 50 ký tự'
      } else {
        delete errors.value.floor
      }
      break

    case 'positionDetail':
      if (value && value.length > 255) {
        errors.value.positionDetail = 'Chi tiết vị trí không được vượt quá 255 ký tự'
      } else {
        delete errors.value.positionDetail
      }
      break

    case 'maxCapacity':
      if (!value || value <= 0) {
        errors.value.maxCapacity = 'Sức chứa tối đa phải lớn hơn 0'
      } else {
        delete errors.value.maxCapacity
      }
      break

    case 'currentCapacity':
      if (value < 0) {
        errors.value.currentCapacity = 'Sức chứa hiện tại không được âm'
      } else {
        delete errors.value.currentCapacity
      }
      break
  }
}

const validateForm = () => {
  Object.keys(formData.value).forEach(key => {
    validateField(key, formData.value[key])
  })
}

// Watchers
watch(() => props.initialData, (newData) => {
  if (newData) {
    initializeFormData()
  }
}, { deep: true, immediate: true })

watch(() => formData.value.warehouseId, (value) => validateField('warehouseId', value))
watch(() => formData.value.locationCode, (value) => validateField('locationCode', value))
watch(() => formData.value.shelf, (value) => validateField('shelf', value))
watch(() => formData.value.floor, (value) => validateField('floor', value))
watch(() => formData.value.positionDetail, (value) => validateField('positionDetail', value))
watch(() => formData.value.maxCapacity, (value) => validateField('maxCapacity', value))
watch(() => formData.value.currentCapacity, (value) => validateField('currentCapacity', value))

// Methods
const handleSubmit = () => {
  validateForm()
  
  if (isFormValid.value) {
    const submitData = { ...formData.value }
    
    // Clean up empty strings
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === '') {
        submitData[key] = null
      }
    })
    
    emit('submit', submitData)
  }
}

// Initialize validation on mount
onMounted(() => {
  initializeFormData()
  validateForm()
})
</script>
