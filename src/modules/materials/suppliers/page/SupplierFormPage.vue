<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-4 mb-4">
          <button
            @click="handleBack"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới' }}
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ isEditMode ? 'Cập nhật thông tin nhà cung cấp' : 'Nhập thông tin nhà cung cấp mới' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && isEditMode" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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

      <!-- Form -->
      <div v-else>
        <SupplierForm
          :initialData="supplierData"
          :loading="submitLoading"
          @submit="handleSubmit"
          @cancel="handleBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

import { useSupplierStore } from '../store/supplierStore'
import SupplierForm from '../components/SupplierForm.vue'

const route = useRoute()
const router = useRouter()
const supplierStore = useSupplierStore()

// State
const submitLoading = ref(false)
const supplierData = ref({})

// Computed
const isEditMode = computed(() => !!route.params.id)
const loading = computed(() => supplierStore.loading)
const error = computed(() => supplierStore.error)

// Methods
const handleBack = () => {
  router.push('/materials/suppliers')
}

const loadSupplierData = async () => {
  if (isEditMode.value) {
    await supplierStore.fetchSupplierById(route.params.id)
    supplierData.value = supplierStore.currentSupplier || {}
  }
}

const handleSubmit = async (formData) => {
  submitLoading.value = true
  
  try {
    if (isEditMode.value) {
      await supplierStore.updateSupplier(route.params.id, formData)
    } else {
      await supplierStore.createSupplier(formData)
    }
    
    // Navigate back to list page on success
    router.push('/materials/suppliers')
  } catch (error) {
    console.error('Error submitting supplier form:', error)
  } finally {
    submitLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadSupplierData()
})
</script>
