<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-5xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="bg-white rounded-lg p-8 shadow-xl">
          <div class="flex items-center space-x-3">
            <svg class="animate-spin h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700 font-medium text-lg">Đang tải...</span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md mx-auto">
          <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p class="text-sm text-gray-500 mb-6">{{ error }}</p>
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="batch">
        <!-- Enhanced Header -->
        <div class="mb-6 sm:mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <button
              @click="goBack"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white shadow-sm transition-all duration-200"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Chỉnh sửa lô vật liệu
              </h1>
              <p class="text-sm sm:text-base text-gray-600 mt-1">
                Chỉnh sửa thông tin lô {{ batch.batchNumber }}
              </p>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <MaterialBatchForm
            mode="edit"
            :initial-data="batch"
            @save="handleSave"
            @cancel="goBack"
          />
        </div>
      </div>

      <!-- Empty State (fallback) -->
      <div v-else class="text-center py-20">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy dữ liệu</h3>
          <p class="text-sm text-gray-500 mb-6">Không thể tải thông tin lô vật liệu</p>
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

import { useMaterialBatchStore } from '../store/materialBatchStore'
import MaterialBatchForm from '../components/MaterialBatchForm.vue'

const route = useRoute()
const router = useRouter()

// Store
const materialBatchStore = useMaterialBatchStore()
const { loading, error } = storeToRefs(materialBatchStore)

// Local state
const batch = ref(null)

const loadBatch = async () => {
  try {
    const batchData = await materialBatchStore.fetchMaterialBatchById(route.params.id)
    batch.value = batchData
  } catch (error) {
    console.error('Failed to load batch:', error)
  }
}

const goBack = () => {
  router.push({ 
    name: 'MaterialBatchDetail', 
    params: { id: route.params.id } 
  })
}

const handleSave = async (batchData) => {
  try {
    const updatedBatch = await materialBatchStore.updateMaterialBatch(route.params.id, batchData)
    router.push({ 
      name: 'MaterialBatchDetail', 
      params: { id: updatedBatch.id } 
    })
  } catch (error) {
    console.error('Failed to update batch:', error)
    throw error
  }
}

onMounted(async () => {
  await loadBatch()
})
</script>
