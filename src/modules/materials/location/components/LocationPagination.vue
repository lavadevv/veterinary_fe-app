<!-- LocationPagination.vue - Component phân trang cho location -->
<template>
  <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-lg">
    <div class="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
      <!-- Info -->
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="goToPrevious"
          :disabled="pagination.currentPage === 1"
          :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md',
            pagination.currentPage === 1
              ? 'border-gray-300 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          ]"
        >
          Trước
        </button>
        
        <span class="text-sm text-gray-700 flex items-center">
          Trang {{ pagination.currentPage }} / {{ pagination.totalPages }}
        </span>
        
        <button
          @click="goToNext"
          :disabled="pagination.currentPage === pagination.totalPages"
          :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md',
            pagination.currentPage === pagination.totalPages
              ? 'border-gray-300 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          ]"
        >
          Sau
        </button>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <!-- Info Text -->
        <div>
          <p class="text-sm text-gray-700">
            Hiển thị
            <span class="font-medium">{{ startItem }}</span>
            đến
            <span class="font-medium">{{ endItem }}</span>
            trong tổng số
            <span class="font-medium">{{ pagination.total }}</span>
            kết quả
          </p>
        </div>

        <!-- Pagination Controls -->
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- Previous Button -->
            <button
              @click="goToPrevious"
              :disabled="pagination.currentPage === 1"
              :class="[
                'relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium',
                pagination.currentPage === 1
                  ? 'border-gray-300 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-500 bg-white hover:bg-gray-50'
              ]"
            >
              <span class="sr-only">Trang trước</span>
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <!-- Page Numbers -->
            <template v-for="page in visiblePages" :key="page">
              <!-- Page Number -->
              <button
                v-if="typeof page === 'number'"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <!-- Ellipsis -->
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            </template>

            <!-- Next Button -->
            <button
              @click="goToNext"
              :disabled="pagination.currentPage === pagination.totalPages"
              :class="[
                'relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium',
                pagination.currentPage === pagination.totalPages
                  ? 'border-gray-300 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-500 bg-white hover:bg-gray-50'
              ]"
            >
              <span class="sr-only">Trang sau</span>
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>

      <!-- Page Size Selector -->
      <div class="flex items-center space-x-2">
        <label for="pageSize" class="text-sm text-gray-700">Hiển thị:</label>
        <select
          id="pageSize"
          :value="pagination.pageSize"
          @change="changePageSize($event.target.value)"
          class="border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-sm text-gray-700">mục</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  pagination: {
    type: Object,
    required: true,
    default: () => ({
      total: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0
    })
  }
})

// Emits
const emit = defineEmits(['change'])

// Computed
const startItem = computed(() => {
  return (props.pagination.currentPage - 1) * props.pagination.pageSize + 1
})

const endItem = computed(() => {
  const end = props.pagination.currentPage * props.pagination.pageSize
  return Math.min(end, props.pagination.total)
})

const visiblePages = computed(() => {
  const current = props.pagination.currentPage
  const total = props.pagination.totalPages
  const delta = 2 // Number of pages to show around current page
  
  if (total <= 7) {
    // Show all pages if total is small
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const pages = []
  
  // Always show first page
  pages.push(1)
  
  if (current <= delta + 3) {
    // Current page is near the beginning
    for (let i = 2; i <= Math.min(delta + 3, total - 1); i++) {
      pages.push(i)
    }
    if (delta + 3 < total - 1) {
      pages.push('...')
    }
  } else if (current >= total - delta - 2) {
    // Current page is near the end
    if (total - delta - 2 > 2) {
      pages.push('...')
    }
    for (let i = Math.max(total - delta - 2, 2); i <= total - 1; i++) {
      pages.push(i)
    }
  } else {
    // Current page is in the middle
    pages.push('...')
    for (let i = current - delta; i <= current + delta; i++) {
      pages.push(i)
    }
    pages.push('...')
  }
  
  // Always show last page
  if (total > 1) {
    pages.push(total)
  }
  
  return pages
})

// Methods
const goToPage = (page) => {
  if (page !== props.pagination.currentPage && page >= 1 && page <= props.pagination.totalPages) {
    emit('change', page)
  }
}

const goToPrevious = () => {
  if (props.pagination.currentPage > 1) {
    goToPage(props.pagination.currentPage - 1)
  }
}

const goToNext = () => {
  if (props.pagination.currentPage < props.pagination.totalPages) {
    goToPage(props.pagination.currentPage + 1)
  }
}

const changePageSize = (newSize) => {
  const pageSize = parseInt(newSize)
  const newCurrentPage = Math.ceil(startItem.value / pageSize)
  
  emit('change', newCurrentPage, pageSize)
}
</script>
