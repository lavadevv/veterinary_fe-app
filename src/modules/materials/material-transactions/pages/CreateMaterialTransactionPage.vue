<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <div class="flex items-center space-x-3 mb-4">
          <button
            @click="$router.go(-1)"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <PlusIcon class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Tạo giao dịch vật liệu mới
            </h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">
              Tạo giao dịch nhập, xuất, chuyển kho hoặc điều chỉnh vật liệu
            </p>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span class="text-sm font-medium text-emerald-600">Nhập thông tin</span>
              </div>
              
              <div class="w-16 h-0.5 bg-gray-300"></div>
              
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span class="text-sm text-gray-500">Xác nhận</span>
              </div>
              
              <div class="w-16 h-0.5 bg-gray-300"></div>
              
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span class="text-sm text-gray-500">Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6">
          <TransactionForm
            :material-batches="materialBatches"
            :warehouses="warehouses"
            :loading="transactionStore.loading"
            @submit="handleFormSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div class="flex items-start space-x-3">
          <InformationCircleIcon class="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 class="text-sm font-medium text-blue-900 mb-2">Hướng dẫn tạo giao dịch</h3>
            <div class="text-sm text-blue-800 space-y-1">
              <p><strong>Nhập kho (IMPORT):</strong> Thêm vật liệu mới vào kho từ nhà cung cấp</p>
              <p><strong>Xuất kho (EXPORT):</strong> Lấy vật liệu ra khỏi kho để sử dụng</p>
              <p><strong>Chuyển kho (TRANSFER):</strong> Di chuyển vật liệu từ kho này sang kho khác</p>
              <p><strong>Điều chỉnh (ADJUSTMENT):</strong> Chỉnh sửa số lượng tồn kho do kiểm kê</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <TransitionRoot as="template" :show="showSuccessModal">
      <Dialog as="div" class="relative z-50" @close="showSuccessModal = false">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div class="text-center">
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="mt-3">
                    <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                      Tạo giao dịch thành công!
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Giao dịch #{{ createdTransactionId }} đã được tạo và đang chờ phê duyệt.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="mt-5 sm:mt-6 space-y-3">
                  <button
                    @click="viewTransaction"
                    class="inline-flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    Xem giao dịch
                  </button>
                  <button
                    @click="createAnother"
                    class="inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Tạo giao dịch khác
                  </button>
                  <button
                    @click="backToList"
                    class="inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Quay lại danh sách
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useMaterialTransactionStore } from '../store/materialTransactionStore'
import { useMaterialBatchStore } from '../../material-batches/store/materialBatchStore'
import TransactionForm from '../components/TransactionForm.vue'

// Hero Icons
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const transactionStore = useMaterialTransactionStore()
const materialBatchStore = useMaterialBatchStore()

// State
const showSuccessModal = ref(false)
const createdTransactionId = ref(null)
const materialBatches = ref([])
const warehouses = ref([
  { id: 1, name: 'Kho A', address: '123 Đường ABC' },
  { id: 2, name: 'Kho B', address: '456 Đường DEF' }
])

// Methods
const loadData = async () => {
  try {
    await materialBatchStore.fetchMaterialBatches()
    materialBatches.value = materialBatchStore.materialBatches
  } catch (error) {
    console.error('Error loading material batches:', error)
  }
}

const handleFormSubmit = async (formData) => {
  try {
    const result = await transactionStore.createTransaction(formData)
    if (result) {
      createdTransactionId.value = result.id
      showSuccessModal.value = true
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
  }
}

const handleCancel = () => {
  router.push('/materials/transactions')
}

const viewTransaction = () => {
  showSuccessModal.value = false
  router.push(`/materials/transactions/${createdTransactionId.value}`)
}

const createAnother = () => {
  showSuccessModal.value = false
  createdTransactionId.value = null
  // Reset form by refreshing the page or resetting form state
  window.location.reload()
}

const backToList = () => {
  showSuccessModal.value = false
  router.push('/materials/transactions')
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
