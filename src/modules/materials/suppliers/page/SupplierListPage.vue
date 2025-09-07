<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý nhà cung cấp</h1>
            <p class="mt-1 text-sm text-gray-500">
              Quản lý thông tin các nhà cung cấp nguyên liệu và sản phẩm
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
            
            <router-link
              to="/materials/suppliers/create"
              class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Thêm nhà cung cấp
            </router-link>
          </div>
        </div>
      </div>

      <!-- Filter Component -->
      <SupplierFilter
        :filters="supplierStore.filters"
        :totalResults="supplierStore.pagination.total"
        @update:filters="handleFilterUpdate"
        @clear-filters="handleClearFilters"
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

      <!-- Suppliers Table -->
      <div v-else>
        <SupplierTable
          :suppliers="suppliers"
          @view-detail="handleViewDetail"
          @edit="handleEdit"
          @toggle-status="handleToggleStatus"
        />

        <!-- Pagination -->
        <div v-if="suppliers.length > 0" class="mt-6">
          <SupplierPagination
            :total="supplierStore.pagination.total"
            :start="supplierStore.pagination.start"
            :limit="supplierStore.pagination.limit"
            @update:page="handlePageChange"
            @update:limit="handleLimitChange"
          />
        </div>
      </div>
    </div>

    <!-- Toggle Status Confirmation Modal -->
    <TransitionRoot :show="showStatusModal" as="template">
      <Dialog as="div" class="relative z-10" @close="showStatusModal = false">
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
                <div class="sm:flex sm:items-start">
                  <div :class="[
                    'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
                    selectedSupplier?.isActive ? 'bg-red-100' : 'bg-green-100'
                  ]">
                    <ExclamationTriangleIcon 
                      v-if="selectedSupplier?.isActive"
                      class="h-6 w-6 text-red-600" 
                    />
                    <CheckCircleIcon 
                      v-else
                      class="h-6 w-6 text-green-600" 
                    />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      {{ selectedSupplier?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt' }} nhà cung cấp
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Bạn có chắc chắn muốn {{ selectedSupplier?.isActive ? 'vô hiệu hóa' : 'kích hoạt' }} 
                        nhà cung cấp <strong>{{ selectedSupplier?.supplierName }}</strong>?
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    @click="confirmToggleStatus"
                    :disabled="toggleStatusLoading"
                    :class="[
                      'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto',
                      selectedSupplier?.isActive 
                        ? 'bg-red-600 text-white hover:bg-red-500' 
                        : 'bg-green-600 text-white hover:bg-green-500',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    ]"
                  >
                    <div class="flex items-center">
                      <svg v-if="toggleStatusLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ selectedSupplier?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt' }}
                    </div>
                  </button>
                  <button
                    @click="showStatusModal = false"
                    :disabled="toggleStatusLoading"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Hủy
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { 
  PlusIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'

import { useSupplierStore } from '../store/supplierStore'
import SupplierFilter from '../components/SupplierFilter.vue'
import SupplierTable from '../components/SupplierTable.vue'
import SupplierPagination from '../components/SupplierPagination.vue'

const router = useRouter()
const supplierStore = useSupplierStore()

// State
const showStatusModal = ref(false)
const selectedSupplier = ref(null)
const toggleStatusLoading = ref(false)

// Computed
const suppliers = computed(() => supplierStore.suppliers)
const loading = computed(() => supplierStore.loading)
const error = computed(() => supplierStore.error)

// Methods
const refreshData = async () => {
  await supplierStore.fetchSuppliers()
}

const handleFilterUpdate = (filters) => {
  supplierStore.setFilters(filters)
}

const handleClearFilters = () => {
  supplierStore.clearFilters()
}

const handlePageChange = (page) => {
  supplierStore.setPage(page)
}

const handleLimitChange = (limit) => {
  supplierStore.setLimit(limit)
}

const handleViewDetail = (supplierId) => {
  router.push(`/materials/suppliers/${supplierId}`)
}

const handleEdit = (supplierId) => {
  router.push(`/materials/suppliers/${supplierId}/edit`)
}

const handleToggleStatus = (supplier) => {
  selectedSupplier.value = supplier
  showStatusModal.value = true
}

const confirmToggleStatus = async () => {
  if (!selectedSupplier.value) return

  toggleStatusLoading.value = true
  try {
    await supplierStore.toggleSupplierStatus(selectedSupplier.value.id)
    showStatusModal.value = false
    selectedSupplier.value = null
  } catch (error) {
    console.error('Error toggling supplier status:', error)
  } finally {
    toggleStatusLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>
