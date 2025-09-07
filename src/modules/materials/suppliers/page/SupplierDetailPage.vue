<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Đang tải thông tin nhà cung cấp...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div class="text-center">
          <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Có lỗi xảy ra</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <button
            @click="loadSupplierData"
            class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="supplier">
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
                  {{ supplier.supplierName }}
                </h1>
                <span 
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium flex-shrink-0',
                    supplier.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ supplier.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </div>
              <p class="text-sm text-gray-500">Mã: {{ supplier.supplierCode }}</p>
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
              @click="handleToggleStatus"
              :class="[
                'inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors',
                supplier.isActive
                  ? 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                  : 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
              ]"
            >
              <component :is="supplier.isActive ? XMarkIcon : CheckIcon" class="h-4 w-4 mr-2" />
              {{ supplier.isActive ? 'Vô hiệu hóa' : 'Kích hoạt' }}
            </button>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Information -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Basic Info -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
              
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tên nhà cung cấp</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.supplierName }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Mã nhà cung cấp</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.supplierCode }}</dd>
                </div>
                
                <div v-if="supplier.manufacturerName">
                  <dt class="text-sm font-medium text-gray-500">Nhà sản xuất</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.manufacturerName }}</dd>
                </div>
                
                <div v-if="supplier.distributorName">
                  <dt class="text-sm font-medium text-gray-500">Nhà phân phối</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.distributorName }}</dd>
                </div>
                
                <div v-if="supplier.countryOfOrigin">
                  <dt class="text-sm font-medium text-gray-500">Quốc gia xuất xứ</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.countryOfOrigin }}</dd>
                </div>
                
                <div v-if="supplier.registrationNumber">
                  <dt class="text-sm font-medium text-gray-500">Số đăng ký kinh doanh</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.registrationNumber }}</dd>
                </div>
              </dl>
              
              <div v-if="supplier.address" class="mt-4">
                <dt class="text-sm font-medium text-gray-500">Địa chỉ</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ supplier.address }}</dd>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h3>
              
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-if="supplier.contactPerson">
                  <dt class="text-sm font-medium text-gray-500">Người liên hệ</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.contactPerson }}</dd>
                </div>
                
                <div v-if="supplier.phone">
                  <dt class="text-sm font-medium text-gray-500">Số điện thoại</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <a :href="`tel:${supplier.phone}`" class="text-blue-600 hover:text-blue-500">
                      {{ supplier.phone }}
                    </a>
                  </dd>
                </div>
                
                <div v-if="supplier.email" class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <a :href="`mailto:${supplier.email}`" class="text-blue-600 hover:text-blue-500">
                      {{ supplier.email }}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Notes -->
            <div v-if="supplier.notes" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Ghi chú</h3>
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ supplier.notes }}</p>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- GMP Certificate -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Chứng chỉ GMP</h3>
              
              <div v-if="supplier.gmpCertificate" class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số chứng chỉ</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ supplier.gmpCertificate }}</dd>
                </div>
                
                <div v-if="supplier.gmpExpiryDate">
                  <dt class="text-sm font-medium text-gray-500">Ngày hết hạn</dt>
                  <dd class="mt-1">
                    <span :class="getGmpExpiryClass(supplier.gmpExpiryDate)">
                      {{ formatDate(supplier.gmpExpiryDate) }}
                    </span>
                    <div class="mt-1">
                      <span :class="getGmpStatusBadgeClass(supplier.gmpExpiryDate)">
                        {{ getGmpStatusText(supplier.gmpExpiryDate) }}
                      </span>
                    </div>
                  </dd>
                </div>
              </div>
              
              <div v-else class="text-sm text-gray-500">
                Chưa có thông tin chứng chỉ GMP
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin khác</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Trạng thái</span>
                  <span 
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      supplier.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ supplier.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </div>
                
                <!-- Add more stats here if needed -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

import { useSupplierStore } from '../store/supplierStore'

const route = useRoute()
const router = useRouter()
const supplierStore = useSupplierStore()

// Computed
const supplier = computed(() => supplierStore.currentSupplier)
const loading = computed(() => supplierStore.loading)
const error = computed(() => supplierStore.error)

// Methods
const handleBack = () => {
  router.push('/materials/suppliers')
}

const handleEdit = () => {
  router.push(`/materials/suppliers/${route.params.id}/edit`)
}

const handleToggleStatus = async () => {
  if (!supplier.value) return
  
  try {
    await supplierStore.toggleSupplierStatus(supplier.value.id)
  } catch (error) {
    console.error('Error toggling supplier status:', error)
  }
}

const loadSupplierData = async () => {
  await supplierStore.fetchSupplierById(route.params.id)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getGmpExpiryClass = (expiryDate) => {
  if (!expiryDate) return 'text-gray-500'
  
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return 'text-red-600 font-medium' // Expired
  } else if (daysUntilExpiry <= 30) {
    return 'text-yellow-600 font-medium' // Expiring soon
  } else {
    return 'text-green-600' // Valid
  }
}

const getGmpStatusText = (expiryDate) => {
  if (!expiryDate) return 'Không có thông tin'
  
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return 'Đã hết hạn'
  } else if (daysUntilExpiry <= 30) {
    return `Sắp hết hạn (${daysUntilExpiry} ngày)`
  } else {
    return 'Còn hiệu lực'
  }
}

const getGmpStatusBadgeClass = (expiryDate) => {
  if (!expiryDate) return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'
  } else if (daysUntilExpiry <= 30) {
    return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
  } else {
    return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'
  }
}

// Lifecycle
onMounted(() => {
  loadSupplierData()
})
</script>
