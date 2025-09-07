<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý vật liệu</h1>
            <p class="mt-1 text-sm text-gray-500">
              Quản lý thông tin nguyên liệu, bao bì và vật tư sản xuất
            </p>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              @click="refreshData"
              :disabled="loading"
              class="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
              Làm mới
            </button>
            
            <button
              @click="exportData"
              class="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
              Xuất Excel
            </button>
            
            <button
              @click="navigateToCreate"
              class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Thêm vật liệu
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" v-if="!loading">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CubeIcon class="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tổng vật liệu</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalMaterials }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon class="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Đang hoạt động</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon class="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tồn kho thấp</p>
              <p class="text-2xl font-semibold text-gray-900">{{ lowStockCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CircleStackIcon class="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Bảo quản lạnh</p>
              <p class="text-2xl font-semibold text-gray-900">{{ coldStorageCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Component -->
      <MaterialFilterNew
        :filters="materialStore.filters"
        :totalResults="totalMaterials"
        @update:filters="handleFiltersUpdate"
        @reset="handleFiltersReset"
      />

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div class="text-center">
          <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Có lỗi xảy ra</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <button
            @click="refreshData"
            class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Materials Table -->
      <div v-else>
        <MaterialTable
          :materials="materials"
          @view="navigateToDetail"
          @edit="navigateToEdit"
          @delete="confirmDelete"
          @toggle-status="confirmToggleStatus"
        />

        <!-- Pagination -->
        <div v-if="materials.length > 0" class="mt-6">
          <MaterialPagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :total="totalMaterials"
            :page-size="materialStore.filters.limit"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>

    <!-- Confirmation Dialogs -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :isOpen="showDeleteConfirm"
      title="Xóa vật liệu"
      :message="`Bạn có chắc chắn muốn xóa vật liệu '${selectedMaterial?.name}'? Hành động này không thể hoàn tác.`"
      confirmText="Xóa"
      confirmClass="bg-red-600 hover:bg-red-700"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />

    <ConfirmDialog
      v-if="showToggleStatusConfirm"
      :isOpen="showToggleStatusConfirm"
      :title="selectedMaterial?.isActive ? 'Vô hiệu hóa vật liệu' : 'Kích hoạt vật liệu'"
      :message="`Bạn có chắc chắn muốn ${selectedMaterial?.isActive ? 'vô hiệu hóa' : 'kích hoạt'} vật liệu '${selectedMaterial?.name}'?`"
      :confirmText="selectedMaterial?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'"
      @confirm="handleToggleStatus"
      @cancel="showToggleStatusConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline'

// Components
import MaterialFilterNew from '../components/MaterialFilterNew.vue'
import MaterialTable from '../components/MaterialTable.vue'
import MaterialPagination from '../components/MaterialPagination.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// Store
import { useMaterialStore } from '../store/materialStore'

// Composables
import { useToast } from '@/config/toast'

const router = useRouter()
const materialStore = useMaterialStore()
const { showSuccess, showError, showInfo, showWarning } = useToast()

// Local state
const error = ref(null)

// Modal states
const selectedMaterial = ref(null)
const showDeleteConfirm = ref(false)
const showToggleStatusConfirm = ref(false)

// Computed properties
const materials = computed(() => materialStore.materials)
const totalMaterials = computed(() => materialStore.totalMaterials)
const currentPage = computed(() => materialStore.currentPage)
const totalPages = computed(() => materialStore.totalPages)
const loading = computed(() => materialStore.loading)

// Stats
const activeCount = computed(() => {
  return materials.value.filter(material => material.isActive).length
})

const lowStockCount = computed(() => {
  return materials.value.filter(material => 
    material.currentStock <= material.minimumStockLevel
  ).length
})

const coldStorageCount = computed(() => {
  return materials.value.filter(material => material.requiresColdStorage).length
})

// Methods
const loadMaterials = async () => {
  try {
    error.value = null
    await materialStore.fetchMaterials()
  } catch (err) {
    console.error('Error loading materials:', err)
    error.value = 'Không thể tải dữ liệu vật liệu. Vui lòng thử lại sau.'
  }
}

const refreshData = async () => {
  await loadMaterials()
  showSuccess('Dữ liệu đã được làm mới')
}

const exportData = () => {
  // TODO: Implement export functionality
  showInfo('Tính năng xuất Excel đang được phát triển')
}

// Filter handlers
const handleFiltersUpdate = (newFilters) => {
  materialStore.updateFilters(newFilters)
  loadMaterials()
}

const handleFiltersReset = () => {
  materialStore.resetFilters()
  loadMaterials()
}

// Pagination handlers
const handlePageChange = (page) => {
  materialStore.setPage(page)
}

const handlePageSizeChange = (size) => {
  materialStore.setPageSize(size)
}

// Modal handlers
const navigateToCreate = () => {
  router.push({ name: 'MaterialCreate' })
}

const navigateToDetail = (material) => {
  router.push({ name: 'MaterialDetail', params: { id: material.id } })
}

const navigateToEdit = (material) => {
  router.push({ name: 'MaterialEdit', params: { id: material.id } })
}

const confirmDelete = (material) => {
  selectedMaterial.value = material
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!selectedMaterial.value) return
  
  try {
    await materialStore.deleteMaterial(selectedMaterial.value.id)
    showSuccess(`Đã xóa vật liệu "${selectedMaterial.value.name}"`)
    showDeleteConfirm.value = false
    selectedMaterial.value = null
    await loadMaterials()
  } catch (error) {
    console.error('Error deleting material:', error)
    showError('Lỗi khi xóa vật liệu')
  }
}

const confirmToggleStatus = (material) => {
  selectedMaterial.value = material
  showToggleStatusConfirm.value = true
}

const handleToggleStatus = async () => {
  if (!selectedMaterial.value) return
  
  try {
    await materialStore.toggleMaterialStatus(selectedMaterial.value.id)
    const action = selectedMaterial.value.isActive ? 'vô hiệu hóa' : 'kích hoạt'
    showSuccess(`Đã ${action} vật liệu "${selectedMaterial.value.name}"`)
    showToggleStatusConfirm.value = false
    selectedMaterial.value = null
    await loadMaterials()
  } catch (error) {
    console.error('Error toggling material status:', error)
    showError('Lỗi khi thay đổi trạng thái vật liệu')
  }
}

// Load initial data
onMounted(() => {
  loadMaterials()
})
</script>
