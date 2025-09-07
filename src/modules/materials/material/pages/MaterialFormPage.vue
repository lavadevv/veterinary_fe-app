<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-start gap-4">
          <button
            @click="handleBack"
            class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </button>
          
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Chỉnh sửa vật liệu' : 'Thêm vật liệu mới' }}
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ isEditMode ? 'Cập nhật thông tin vật liệu' : 'Nhập thông tin vật liệu mới' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div class="border-b border-gray-200 pb-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
            <p class="mt-1 text-sm text-gray-500">Nhập thông tin cơ bản của vật liệu</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Material Code -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Mã vật liệu <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.materialCode"
                type="text"
                required
                maxlength="50"
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.materialCode ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
                placeholder="Ví dụ: MAT-20250906-001"
              />
              <p v-if="errors.materialCode" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.materialCode }}
              </p>
            </div>

            <!-- Material Name -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Tên vật liệu <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.materialName"
                type="text"
                required
                maxlength="255"
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.materialName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
                placeholder="Ví dụ: Kháng sinh Amoxicillin"
              />
              <p v-if="errors.materialName" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.materialName }}
              </p>
            </div>

            <!-- Material Type -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Loại vật liệu <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.materialType"
                required
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.materialType ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
              >
                <option value="">Chọn loại vật liệu</option>
                <option
                  v-for="type in MATERIAL_TYPES"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </option>
              </select>
              <p v-if="errors.materialType" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.materialType }}
              </p>
            </div>

            <!-- Unit -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Đơn vị tính <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.unit"
                type="text"
                required
                maxlength="20"
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.unit ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
                placeholder="Ví dụ: kg, lít, viên, hộp"
              />
              <p v-if="errors.unit" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.unit }}
              </p>
            </div>

            <!-- Manufacturer -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Nhà sản xuất
              </label>
              <input
                v-model="form.manufacturer"
                type="text"
                maxlength="255"
                class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
                placeholder="Ví dụ: Công ty Dược phẩm ABC"
              />
            </div>

            <!-- Country of Origin -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Xuất xứ
              </label>
              <input
                v-model="form.countryOfOrigin"
                type="text"
                maxlength="100"
                class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
                placeholder="Ví dụ: Việt Nam, Hoa Kỳ, Nhật Bản"
              />
            </div>
          </div>

          <!-- Description (Full width) -->
          <div class="mt-6 space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 resize-none"
              placeholder="Nhập mô tả chi tiết về vật liệu..."
            ></textarea>
          </div>
        </div>

        <!-- Stock Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div class="border-b border-gray-200 pb-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Thông tin tồn kho</h3>
            <p class="mt-1 text-sm text-gray-500">Cài đặt mức tồn kho và giá cả</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Current Stock -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Tồn kho hiện tại <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.currentStock"
                type="number"
                required
                min="0"
                step="0.01"
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.currentStock ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
                placeholder="0"
              />
              <p v-if="errors.currentStock" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.currentStock }}
              </p>
            </div>

            <!-- Minimum Stock Level -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Mức tồn kho tối thiểu <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.minimumStockLevel"
                type="number"
                required
                min="0"
                step="0.01"
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.minimumStockLevel ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
                placeholder="0"
              />
              <p v-if="errors.minimumStockLevel" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.minimumStockLevel }}
              </p>
            </div>

            <!-- Maximum Stock Level -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Mức tồn kho tối đa <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.maximumStockLevel"
                type="number"
                required
                min="0"
                step="0.01"
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.maximumStockLevel ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
                placeholder="0"
              />
              <p v-if="errors.maximumStockLevel" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.maximumStockLevel }}
              </p>
            </div>
          </div>

          <!-- Unit Price -->
          <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Giá đơn vị <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.unitPrice"
                type="number"
                required
                min="0"
                step="0.01"
                :class="[
                  'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.unitPrice ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                ]"
                placeholder="0"
              />
              <p v-if="errors.unitPrice" class="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon class="h-4 w-4" />
                {{ errors.unitPrice }}
              </p>
            </div>

            <!-- Cold Storage Required -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Bảo quản lạnh
              </label>
              <div class="mt-2">
                <label class="inline-flex items-center">
                  <input
                    v-model="form.requiresColdStorage"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-900">Yêu cầu bảo quản lạnh</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Specifications -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div class="border-b border-gray-200 pb-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Thông số kỹ thuật</h3>
            <p class="mt-1 text-sm text-gray-500">Thông tin kỹ thuật và bào chế (nếu có)</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Active Ingredient -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Hoạt chất
              </label>
              <input
                v-model="form.activeIngredient"
                type="text"
                maxlength="255"
                class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
                placeholder="Ví dụ: Amoxicillin trihydrate"
              />
            </div>

            <!-- Concentration -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Nồng độ
              </label>
              <input
                v-model="form.concentration"
                type="text"
                maxlength="100"
                class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
                placeholder="Ví dụ: 500mg/viên"
              />
            </div>

            <!-- Dosage Form -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Dạng bào chế
              </label>
              <input
                v-model="form.dosageForm"
                type="text"
                maxlength="100"
                class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
                placeholder="Ví dụ: Viên nang, dung dịch tiêm"
              />
            </div>

            <!-- Expiry Date -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Hạn sử dụng
              </label>
              <input
                v-model="form.expiryDate"
                type="date"
                class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
              />
            </div>
          </div>

          <!-- Specifications (Full width) -->
          <div class="mt-6 space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Thông số kỹ thuật
            </label>
            <textarea
              v-model="form.specifications"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 resize-none"
              placeholder="Nhập thông số kỹ thuật chi tiết..."
            ></textarea>
          </div>

          <!-- Storage Conditions (Full width) -->
          <div class="mt-6 space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Điều kiện bảo quản
            </label>
            <textarea
              v-model="form.storageConditions"
              rows="2"
              class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 resize-none"
              placeholder="Ví dụ: Bảo quản nơi khô ráo, tránh ánh nảng mặt trời..."
            ></textarea>
          </div>
        </div>

        <!-- Quality Control -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div class="border-b border-gray-200 pb-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Kiểm soát chất lượng</h3>
            <p class="mt-1 text-sm text-gray-500">Tiêu chuẩn và quy trình kiểm nghiệm chất lượng</p>
          </div>
          
          <!-- Quality Standards (Full width) -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Tiêu chuẩn chất lượng
            </label>
            <textarea
              v-model="form.qualityStandards"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 resize-none"
              placeholder="Ví dụ: Đạt tiêu chuẩn GMP, ISO 9001..."
            ></textarea>
          </div>

          <!-- Quality Testing Procedures (Full width) -->
          <div class="mt-6 space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Quy trình kiểm nghiệm
            </label>
            <textarea
              v-model="form.qualityTestingProcedures"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 resize-none"
              placeholder="Mô tả quy trình kiểm nghiệm chất lượng..."
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            type="button"
            @click="handleBack"
            :disabled="loading"
            class="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditMode ? 'Đang cập nhật...' : 'Đang tạo...' }}
            </span>
            <span v-else>
              {{ isEditMode ? 'Cập nhật vật liệu' : 'Tạo vật liệu' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

// Store
import { useMaterialStore } from '../store/materialStore'

// Composables
import { useToast } from '@/config/toast'

// Constants
import { MATERIAL_TYPES } from '../constants/materialTypes'

const route = useRoute()
const router = useRouter()
const materialStore = useMaterialStore()
const { showSuccess, showError } = useToast()

// Local state
const loading = ref(false)
const errors = ref({})

const isEditMode = computed(() => !!route.params.id)

// Form data
const form = reactive({
  materialCode: '',
  materialName: '',
  materialType: '',
  unit: '',
  manufacturer: '',
  countryOfOrigin: '',
  description: '',
  currentStock: 0,
  minimumStockLevel: 0,
  maximumStockLevel: 0,
  unitPrice: 0,
  requiresColdStorage: false,
  activeIngredient: '',
  concentration: '',
  dosageForm: '',
  expiryDate: '',
  specifications: '',
  storageConditions: '',
  qualityStandards: '',
  qualityTestingProcedures: ''
})

// Methods
const loadMaterialData = async () => {
  if (!isEditMode.value) return
  
  try {
    loading.value = true
    const materialId = route.params.id
    console.log('Loading material with ID:', materialId)
    
    await materialStore.fetchMaterialById(materialId)
    const material = materialStore.selectedMaterial
    
    console.log('Material from store:', material)
    
    if (material) {
      console.log('Material data loaded:', material)
      Object.assign(form, {
        materialCode: material.materialCode || '',
        materialName: material.materialName || '',
        materialType: material.materialType || '',
        unit: material.unitOfMeasure || '',
        manufacturer: material.supplierDto?.manufacturerName || '',
        countryOfOrigin: material.supplierDto?.countryOfOrigin || '',
        description: material.notes || '',
        currentStock: material.currentStock || 0,
        minimumStockLevel: material.minimumStockLevel || 0,
        maximumStockLevel: 0, // Không có trong API
        unitPrice: material.fixedPrice || 0,
        requiresColdStorage: material.requiresColdStorage || false,
        activeIngredient: material.activeIngredient || '',
        concentration: material.purityPercentage ? `${material.purityPercentage}%` : '',
        dosageForm: material.materialForm || '',
        expiryDate: '', // Không có trong API
        specifications: material.standardApplied || '',
        storageConditions: material.specialHandling || '',
        qualityStandards: material.supplierDto?.gmpCertificate || '',
        qualityTestingProcedures: material.supplierDto?.notes || ''
      })
      console.log('Form after populate:', form)
    } else {
      // Không tìm thấy material, quay lại danh sách
      router.push({ name: 'MaterialList' })
    }
  } catch (error) {
    console.error('Error loading material:', error)
    // Lỗi đã được hiển thị qua toast trong store, chỉ cần quay lại
    router.push({ name: 'materials' })
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.materialCode.trim()) {
    errors.value.materialCode = 'Mã vật liệu là bắt buộc'
  }
  
  if (!form.materialName.trim()) {
    errors.value.materialName = 'Tên vật liệu là bắt buộc'
  }
  
  if (!form.materialType) {
    errors.value.materialType = 'Loại vật liệu là bắt buộc'
  }
  
  if (!form.unit.trim()) {
    errors.value.unit = 'Đơn vị tính là bắt buộc'
  }
  
  if (form.currentStock < 0) {
    errors.value.currentStock = 'Tồn kho hiện tại không được âm'
  }
  
  if (form.minimumStockLevel < 0) {
    errors.value.minimumStockLevel = 'Mức tồn kho tối thiểu không được âm'
  }
  
  if (form.maximumStockLevel < 0) {
    errors.value.maximumStockLevel = 'Mức tồn kho tối đa không được âm'
  }
  
  if (form.maximumStockLevel < form.minimumStockLevel) {
    errors.value.maximumStockLevel = 'Mức tồn kho tối đa phải lớn hơn mức tối thiểu'
  }
  
  if (form.unitPrice < 0) {
    errors.value.unitPrice = 'Giá đơn vị không được âm'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Vui lòng kiểm tra lại thông tin nhập vào')
    return
  }
  
  try {
    loading.value = true
    
    const formData = {
      ...form,
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null
    }
    
    if (isEditMode.value) {
      await materialStore.updateMaterial(route.params.id, formData)
      showSuccess('Cập nhật vật liệu thành công')
    } else {
      await materialStore.createMaterial(formData)
      showSuccess('Tạo vật liệu mới thành công')
    }
    
    router.push({ name: 'MaterialList' })
  } catch (error) {
    console.error('Error saving material:', error)
    showError(isEditMode.value ? 'Lỗi khi cập nhật vật liệu' : 'Lỗi khi tạo vật liệu mới')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push({ name: 'MaterialList' })
}

// Load data on mount
onMounted(() => {
  loadMaterialData()
})
</script>
