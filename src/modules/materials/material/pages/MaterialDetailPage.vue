<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Đang tải thông tin vật liệu...</span>
        </div>
      </div>

      <!-- Content -->
      <div v-if="material">
        <!-- Header -->
        <div class="mb-6">
          <!-- Back button and main info -->
          <div class="flex items-start gap-4 mb-4">
            <button
              @click="handleBack"
              class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </button>
            
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {{ material.materialName }}
                </h1>
                <span 
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium flex-shrink-0',
                    material.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ material.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </div>
              <p class="text-sm text-gray-500">Mã: {{ material.materialCode }}</p>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
            <button
              @click="handleEdit"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <PencilIcon class="h-4 w-4 mr-2" />
              Chỉnh sửa
            </button>
            <button
              @click="handleDelete"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <TrashIcon class="h-4 w-4 mr-2" />
              Xóa
            </button>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tên vật liệu</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.materialName || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tên ngắn</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.shortName || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Mã vật liệu</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.materialCode || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Loại vật liệu</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ getMaterialTypeLabel(material.materialType) || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Dạng vật liệu</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ getMaterialFormLabel(material.materialForm) || 'N/A' }}</dd>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Đơn vị tính</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.unitOfMeasure || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Hoạt chất</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.activeIngredient || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Độ tinh khiết (%)</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.purityPercentage ? material.purityPercentage + '%' : 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">IU/gram</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatNumber(material.iuPerGram) || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Trạng thái</dt>
                  <dd class="mt-1">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        material.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ material.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                    </span>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock & Pricing Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin kho & giá</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">Số lượng tồn kho</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900">
                  {{ formatNumber(material.currentStock) }} {{ material.unitOfMeasure }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Giá cố định</dt>
                <dd class="mt-1 text-lg font-semibold text-green-600">
                  {{ formatCurrency(material.fixedPrice) }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Ngưỡng tối thiểu</dt>
                <dd class="mt-1 text-lg font-semibold text-orange-600">
                  {{ formatNumber(material.minimumStockLevel) }} {{ material.unitOfMeasure }}
                </dd>
              </div>
            </div>
            
            <!-- Storage requirements -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div>
                <dt class="text-sm font-medium text-gray-500">Yêu cầu bảo quản lạnh</dt>
                <dd class="mt-1">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      material.requiresColdStorage 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ material.requiresColdStorage ? 'Có' : 'Không' }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Xử lý đặc biệt</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ material.specialHandling || 'Không có' }}</dd>
              </div>
            </div>
          </div>

          <!-- Supplier Information -->
          <div v-if="material.supplierDto" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin nhà cung cấp</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tên nhà cung cấp</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.supplierName || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Mã nhà cung cấp</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.supplierCode || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.email || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số điện thoại</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.phone || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Địa chỉ</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.address || 'N/A' }}</dd>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Nhà sản xuất</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.manufacturerName || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Nhà phân phối</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.distributorName || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Xuất xứ</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.countryOfOrigin || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Người liên hệ</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.contactPerson || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số đăng ký</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.registrationNumber || 'N/A' }}</dd>
                </div>
              </div>
            </div>
            
            <!-- GMP Certificate Info -->
            <div v-if="material.supplierDto.gmpCertificate" class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Chứng nhận GMP</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số chứng nhận</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.gmpCertificate }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ngày hết hạn</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(material.supplierDto.gmpExpiryDate) }}</dd>
                </div>
              </div>
            </div>
            
            <!-- Supplier Notes -->
            <div v-if="material.supplierDto.notes" class="mt-6 pt-6 border-t border-gray-200">
              <dt class="text-sm font-medium text-gray-500">Ghi chú nhà cung cấp</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ material.supplierDto.notes }}</dd>
            </div>
          </div>

          <!-- Technical Specifications & Quality -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông số kỹ thuật & Chất lượng</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div v-if="material.color">
                  <dt class="text-sm font-medium text-gray-500">Màu sắc</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.color }}</dd>
                </div>
                <div v-if="material.odor">
                  <dt class="text-sm font-medium text-gray-500">Mùi</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.odor }}</dd>
                </div>
                <div v-if="material.moistureContent">
                  <dt class="text-sm font-medium text-gray-500">Độ ẩm (%)</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.moistureContent }}%</dd>
                </div>
                <div v-if="material.viscosity">
                  <dt class="text-sm font-medium text-gray-500">Độ nhớt</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatNumber(material.viscosity) }}</dd>
                </div>
              </div>
              <div class="space-y-4">
                <div v-if="material.standardApplied">
                  <dt class="text-sm font-medium text-gray-500">Tiêu chuẩn áp dụng</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.standardApplied }}</dd>
                </div>
                <div v-if="material.purityPercentage">
                  <dt class="text-sm font-medium text-gray-500">Độ tinh khiết</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.purityPercentage }}%</dd>
                </div>
                <div v-if="material.iuPerGram !== undefined">
                  <dt class="text-sm font-medium text-gray-500">Hoạt tính (IU/g)</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatNumber(material.iuPerGram) }}</dd>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h2>
            <div class="grid grid-cols-1 gap-6">
              <div v-if="material.notes">
                <dt class="text-sm font-medium text-gray-500">Ghi chú</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ material.notes }}</dd>
              </div>
              <div v-if="material.specialHandling">
                <dt class="text-sm font-medium text-gray-500">Hướng dẫn xử lý đặc biệt</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ material.specialHandling }}</dd>
              </div>
            </div>
          </div>

          <!-- System Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div v-if="material.createdAt">
                  <dt class="text-sm font-medium text-gray-500">Ngày tạo</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(material.createdAt) }}</dd>
                </div>
                <div v-if="material.createdBy">
                  <dt class="text-sm font-medium text-gray-500">Người tạo</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.createdBy }}</dd>
                </div>
              </div>
              <div class="space-y-4">
                <div v-if="material.updatedAt">
                  <dt class="text-sm font-medium text-gray-500">Ngày cập nhật</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(material.updatedAt) }}</dd>
                </div>
                <div v-if="material.updatedBy">
                  <dt class="text-sm font-medium text-gray-500">Người cập nhật</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ material.updatedBy }}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :isOpen="showDeleteDialog"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa vật liệu ${material?.materialName}?`"
      confirm-text="Xóa"
      cancel-text="Hủy"
      type="error"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaterialStore } from '../store/materialStore'
import { useToast } from '@/config/toast'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'

// Router & Store
const route = useRoute()
const router = useRouter()
const materialStore = useMaterialStore()
const { showSuccess, showError } = useToast()

// Reactive state
const loading = ref(false)
const showDeleteDialog = ref(false)

// Computed properties
const material = computed(() => materialStore.selectedMaterial)

// Utility functions
/**
 * Format số với phân cách hàng nghìn
 * @param {number} value - Giá trị số cần format
 * @returns {string} Số đã được format
 */
const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A'
  return new Intl.NumberFormat('vi-VN').format(value)
}

/**
 * Format tiền tệ theo định dạng Việt Nam
 * @param {number} value - Giá trị tiền cần format
 * @returns {string} Tiền tệ đã được format
 */
const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

/**
 * Lấy label tiếng Việt cho material type
 * @param {string} type - Material type code
 * @returns {string} Label tiếng Việt
 */
const getMaterialTypeLabel = (type) => {
  const typeLabels = {
    'HOAT_CHAT': 'Hoạt chất',
    'PHU_LIEU': 'Phụ liệu',
    'BAO_BI': 'Bao bì',
    'NGUYEN_LIEU': 'Nguyên liệu',
    'CONG_CU': 'Công cụ',
    'THIET_BI': 'Thiết bị'
  }
  return typeLabels[type] || type
}

/**
 * Lấy label tiếng Việt cho material form
 * @param {string} form - Material form code  
 * @returns {string} Label tiếng Việt
 */
const getMaterialFormLabel = (form) => {
  const formLabels = {
    'BOT': 'Bột',
    'VIEN': 'Viên',
    'LONG': 'Lỏng',
    'GEL': 'Gel',
    'KHAN': 'Khăn',
    'THUNG': 'Thùng',
    'CHAI': 'Chai',
    'TUI': 'Túi',
    'HOP': 'Hộp'
  }
  return formLabels[form] || form
}

/**
 * Format ngày tháng
 * @param {string} dateString - Chuỗi ngày tháng
 * @returns {string} Ngày tháng đã được format
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch (error) {
    return 'N/A'
  }
}

/**
 * Format ngày giờ
 * @param {string} dateString - Chuỗi ngày giờ
 * @returns {string} Ngày giờ đã được format
 */
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('vi-VN')
  } catch (error) {
    return 'N/A'
  }
}

// Event handlers
/**
 * Xử lý quay lại trang trước
 */
const handleBack = () => {
  router.push({ name: 'MaterialList' })
}

/**
 * Xử lý chỉnh sửa vật liệu
 */
const handleEdit = () => {
  router.push({ 
    name: 'MaterialEdit', 
    params: { id: material.value.id } 
  })
}

/**
 * Xử lý xóa vật liệu
 */
const handleDelete = () => {
  showDeleteDialog.value = true
}

/**
 * Xác nhận xóa vật liệu
 */
const confirmDelete = async () => {
  try {
    await materialStore.deleteMaterial(material.value.id)
    showSuccess('🗑️ Xóa vật liệu thành công!')
    router.push({ name: 'MaterialList' })
  } catch (error) {
    showError('❌ Có lỗi xảy ra khi xóa vật liệu')
  } finally {
    showDeleteDialog.value = false
  }
}

/**
 * Tải thông tin vật liệu
 */
const loadMaterial = async () => {
  const materialId = route.params.id
  if (!materialId) {
    showError('❌ Không tìm thấy ID vật liệu')
    router.push({ name: 'MaterialList' })
    return
  }

  loading.value = true
  try {
    await materialStore.fetchMaterialById(materialId)
    if (!material.value) {
      showError('❌ Không tìm thấy vật liệu')
      router.push({ name: 'MaterialList' })
    }
  } catch (error) {
    console.error('Error loading material:', error)
    showError('❌ Có lỗi xảy ra khi tải thông tin vật liệu')
    router.push({ name: 'MaterialList' })
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadMaterial()
})

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadMaterial()
  }
})
</script>
