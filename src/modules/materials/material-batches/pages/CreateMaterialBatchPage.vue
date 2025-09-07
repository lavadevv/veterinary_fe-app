<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-5xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Tạo lô vật liệu mới
            </h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">
              Tạo lô vật liệu mới cho hệ thống quản lý kho
            </p>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <MaterialBatchForm
          mode="create"
          @save="handleSave"
          @cancel="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import MaterialBatchForm from '../components/MaterialBatchForm.vue'
import { useMaterialBatchStore } from '../store/materialBatchStore'

const router = useRouter()
const materialBatchStore = useMaterialBatchStore()

const goBack = () => {
  router.push({ name: 'MaterialBatchList' })
}

const handleSave = async (batchData) => {
  try {
    const savedBatch = await materialBatchStore.createMaterialBatch(batchData)
    router.push({ 
      name: 'MaterialBatchDetail', 
      params: { id: savedBatch.id } 
    })
  } catch (error) {
    console.error('Failed to create batch:', error)
    throw error
  }
}
</script>
