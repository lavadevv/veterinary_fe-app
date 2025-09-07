<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="isOpen">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Backdrop -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>

      <!-- Modal -->
      <div class="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative z-50">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Chỉnh sửa vật liệu' : 'Thêm vật liệu mới' }}
          </h3>
          <button
            @click="closeModal"
            type="button"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="mt-6">
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <!-- Basic Information -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Material Code -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Mã vật liệu <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.materialCode"
                    type="text"
                    maxlength="50"
                    required
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Nhập mã vật liệu"
                  />
                  <p v-if="errors.materialCode" class="mt-1 text-sm text-red-600">
                    {{ errors.materialCode }}
                  </p>
                </div>

                <!-- Material Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tên vật liệu <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.materialName"
                    type="text"
                    maxlength="200"
                    required
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Nhập tên vật liệu"
                  />
                  <p v-if="errors.materialName" class="mt-1 text-sm text-red-600">
                    {{ errors.materialName }}
                  </p>
                </div>

                <!-- Short Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tên viết tắt
                  </label>
                  <input
                    v-model="form.shortName"
                    type="text"
                    maxlength="50"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Nhập tên viết tắt"
                  />
                </div>

                <!-- Unit of Measure -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị tính <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.unitOfMeasure"
                    type="text"
                    maxlength="20"
                    required
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="kg, lít, cái..."
                  />
                  <p v-if="errors.unitOfMeasure" class="mt-1 text-sm text-red-600">
                    {{ errors.unitOfMeasure }}
                  </p>
                </div>

                <!-- Material Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Loại vật liệu <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.materialType"
                    required
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Chọn loại vật liệu</option>
                    <option value="HOAT_CHAT">Hoạt chất</option>
                    <option value="PHU_LIEU">Phụ liệu</option>
                    <option value="BAO_BI">Bao bì</option>
                    <option value="HOA_CHAT">Hóa chất</option>
                    <option value="KHAC">Khác</option>
                  </select>
                  <p v-if="errors.materialType" class="mt-1 text-sm text-red-600">
                    {{ errors.materialType }}
                  </p>
                </div>

                <!-- Material Form -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dạng vật liệu <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.materialForm"
                    required
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Chọn dạng vật liệu</option>
                    <option value="BOT">Bột</option>
                    <option value="VIEN">Viên</option>
                    <option value="LONG">Lỏng</option>
                    <option value="GEL">Gel</option>
                    <option value="KHAN">Khăn</option>
                    <option value="THUNG">Thùng</option>
                    <option value="CHAI">Chai</option>
                    <option value="TUI">Túi</option>
                    <option value="HOP">Hộp</option>
                  </select>
                  <p v-if="errors.materialForm" class="mt-1 text-sm text-red-600">
                    {{ errors.materialForm }}
                  </p>
                </div>

                <!-- Active Ingredient -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Hoạt chất
                  </label>
                  <input
                    v-model="form.activeIngredient"
                    type="text"
                    maxlength="200"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Nhập hoạt chất chính"
                  />
                </div>

                <!-- Purity Percentage -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Độ tinh khiết (%)
                  </label>
                  <input
                    v-model.number="form.purityPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="99.9"
                  />
                </div>

                <!-- IU per Gram -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    IU/gram
                  </label>
                  <input
                    v-model.number="form.iuPerGram"
                    type="number"
                    min="0"
                    step="0.1"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <!-- Physical Properties -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Đặc tính vật lý</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Color -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc
                  </label>
                  <input
                    v-model="form.color"
                    type="text"
                    maxlength="50"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Trắng, Vàng nhạt..."
                  />
                </div>

                <!-- Odor -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Mùi
                  </label>
                  <input
                    v-model="form.odor"
                    type="text"
                    maxlength="50"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Không mùi, Mùi đặc trưng..."
                  />
                </div>

                <!-- Moisture Content -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Độ ẩm (%)
                  </label>
                  <input
                    v-model.number="form.moistureContent"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="4.5"
                  />
                </div>

                <!-- Viscosity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Độ nhớt
                  </label>
                  <input
                    v-model.number="form.viscosity"
                    type="number"
                    min="0"
                    step="0.1"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0"
                  />
                </div>

                <!-- Standard Applied -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu chuẩn áp dụng
                  </label>
                  <input
                    v-model="form.standardApplied"
                    type="text"
                    maxlength="100"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="EP 10, USP 43..."
                  />
                </div>
              </div>
            </div>

            <!-- Pricing and Stock -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Giá và tồn kho</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Fixed Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Giá cố định
                  </label>
                  <input
                    v-model.number="form.fixedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <!-- Minimum Stock Level -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Mức tồn kho tối thiểu
                  </label>
                  <input
                    v-model.number="form.minimumStockLevel"
                    type="number"
                    min="0"
                    step="0.01"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <!-- Current Stock -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho hiện tại
                  </label>
                  <input
                    v-model.number="form.currentStock"
                    type="number"
                    min="0"
                    step="0.01"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <!-- Storage and Notes -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Bảo quản và ghi chú</h4>
              
              <div class="space-y-4">
                <!-- Cold Storage -->
                <div class="flex items-center">
                  <input
                    v-model="form.requiresColdStorage"
                    type="checkbox"
                    :disabled="loading"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label class="ml-2 block text-sm text-gray-700">
                    Yêu cầu bảo quản lạnh
                  </label>
                </div>

                <!-- Active Status -->
                <div class="flex items-center">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    :disabled="loading"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label class="ml-2 block text-sm text-gray-700">
                    Trạng thái hoạt động
                  </label>
                </div>

                <!-- Special Handling -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Hướng dẫn xử lý đặc biệt
                  </label>
                  <textarea
                    v-model="form.specialHandling"
                    rows="2"
                    maxlength="200"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Tránh tiếp xúc với độ ẩm cao..."
                  />
                </div>

                <!-- Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    maxlength="500"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Nhập ghi chú về vật liệu..."
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              @click="closeModal"
              type="button"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
              <span v-else>
                {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  material: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

// Form data
const form = ref({
  materialCode: '',
  materialName: '',
  shortName: '',
  materialType: '',
  materialForm: '',
  unitOfMeasure: '',
  activeIngredient: '',
  purityPercentage: null,
  iuPerGram: null,
  color: '',
  odor: '',
  moistureContent: null,
  viscosity: null,
  standardApplied: '',
  fixedPrice: null,
  minimumStockLevel: null,
  currentStock: null,
  requiresColdStorage: false,
  isActive: true,
  specialHandling: '',
  notes: ''
})

// Form validation errors
const errors = ref({})

// Computed
const isEdit = computed(() => !!props.material)

// Methods
const resetForm = () => {
  form.value = {
    materialCode: '',
    materialName: '',
    shortName: '',
    materialType: '',
    materialForm: '',
    unitOfMeasure: '',
    activeIngredient: '',
    purityPercentage: null,
    iuPerGram: null,
    color: '',
    odor: '',
    moistureContent: null,
    viscosity: null,
    standardApplied: '',
    fixedPrice: null,
    minimumStockLevel: null,
    currentStock: null,
    requiresColdStorage: false,
    isActive: true,
    specialHandling: '',
    notes: ''
  }
  errors.value = {}
}

const populateForm = (material) => {
  if (material) {
    form.value = {
      materialCode: material.materialCode || '',
      materialName: material.materialName || '',
      shortName: material.shortName || '',
      materialType: material.materialType || '',
      materialForm: material.materialForm || '',
      unitOfMeasure: material.unitOfMeasure || '',
      activeIngredient: material.activeIngredient || '',
      purityPercentage: material.purityPercentage || null,
      iuPerGram: material.iuPerGram || null,
      color: material.color || '',
      odor: material.odor || '',
      moistureContent: material.moistureContent || null,
      viscosity: material.viscosity || null,
      standardApplied: material.standardApplied || '',
      fixedPrice: material.fixedPrice || null,
      minimumStockLevel: material.minimumStockLevel || null,
      currentStock: material.currentStock || null,
      requiresColdStorage: material.requiresColdStorage || false,
      isActive: material.isActive !== undefined ? material.isActive : true,
      specialHandling: material.specialHandling || '',
      notes: material.notes || ''
    }
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.materialCode) {
    errors.value.materialCode = 'Mã vật liệu là bắt buộc'
  }
  
  if (!form.value.materialName) {
    errors.value.materialName = 'Tên vật liệu là bắt buộc'
  }
  
  if (!form.value.materialType) {
    errors.value.materialType = 'Loại vật liệu là bắt buộc'
  }
  
  if (!form.value.materialForm) {
    errors.value.materialForm = 'Dạng vật liệu là bắt buộc'
  }
  
  if (!form.value.unitOfMeasure) {
    errors.value.unitOfMeasure = 'Đơn vị tính là bắt buộc'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  const formData = {
    ...form.value,
    // Remove null values for cleaner payload
    fixedPrice: form.value.fixedPrice || undefined,
    minimumStockLevel: form.value.minimumStockLevel || undefined,
    currentStock: form.value.currentStock || undefined
  }
  
  emit('submit', formData)
}

const closeModal = () => {
  emit('close')
}

// Watch for material changes
watch(() => props.material, (newMaterial) => {
  if (newMaterial) {
    populateForm(newMaterial)
  } else {
    resetForm()
  }
}, { immediate: true })
</script>