<template>
  <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Results info -->
      <div class="text-sm text-gray-700">
        Hiển thị 
        <span class="font-medium">{{ startItem }}</span>
        đến 
        <span class="font-medium">{{ endItem }}</span>
        trong tổng số 
        <span class="font-medium">{{ total }}</span>
        kết quả
      </div>

      <!-- Page size selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-700">Hiển thị:</label>
        <select
          :value="limit"
          @change="$emit('update:limit', parseInt($event.target.value))"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-sm text-gray-700">mục</span>
      </div>

      <!-- Pagination controls -->
      <div class="flex items-center gap-1">
        <!-- Previous button -->
        <button
          @click="$emit('update:page', currentPage - 1)"
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md border',
            currentPage === 1
              ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          ]"
        >
          <ChevronLeftIcon class="h-4 w-4" />
          <span class="hidden sm:inline ml-1">Trước</span>
        </button>

        <!-- Page numbers -->
        <div class="flex items-center gap-1">
          <!-- First page -->
          <button
            v-if="showFirstPage"
            @click="$emit('update:page', 1)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md border',
              currentPage === 1
                ? 'text-blue-600 bg-blue-50 border-blue-500'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            ]"
          >
            1
          </button>

          <!-- First ellipsis -->
          <span v-if="showFirstEllipsis" class="px-2 text-gray-500">...</span>

          <!-- Visible page numbers -->
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('update:page', page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md border',
              currentPage === page
                ? 'text-blue-600 bg-blue-50 border-blue-500'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>

          <!-- Last ellipsis -->
          <span v-if="showLastEllipsis" class="px-2 text-gray-500">...</span>

          <!-- Last page -->
          <button
            v-if="showLastPage"
            @click="$emit('update:page', totalPages)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md border',
              currentPage === totalPages
                ? 'text-blue-600 bg-blue-50 border-blue-500'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ totalPages }}
          </button>
        </div>

        <!-- Next button -->
        <button
          @click="$emit('update:page', currentPage + 1)"
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md border',
            currentPage === totalPages
              ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          ]"
        >
          <span class="hidden sm:inline mr-1">Sau</span>
          <ChevronRightIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Mobile simplified pagination -->
    <div class="flex sm:hidden justify-between items-center mt-4">
      <button
        @click="$emit('update:page', currentPage - 1)"
        :disabled="currentPage === 1"
        :class="[
          'flex items-center px-4 py-2 text-sm font-medium rounded-md border',
          currentPage === 1
            ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
        ]"
      >
        <ChevronLeftIcon class="h-4 w-4 mr-1" />
        Trước
      </button>

      <span class="text-sm text-gray-700">
        Trang {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        @click="$emit('update:page', currentPage + 1)"
        :disabled="currentPage === totalPages"
        :class="[
          'flex items-center px-4 py-2 text-sm font-medium rounded-md border',
          currentPage === totalPages
            ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
        ]"
      >
        Sau
        <ChevronRightIcon class="h-4 w-4 ml-1" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  start: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  }
})

defineEmits(['update:page', 'update:limit'])

const currentPage = computed(() => Math.floor(props.start / props.limit) + 1)
const totalPages = computed(() => Math.ceil(props.total / props.limit))
const startItem = computed(() => props.start + 1)
const endItem = computed(() => Math.min(props.start + props.limit, props.total))

// Pagination logic
const visiblePages = computed(() => {
  const delta = 2 // Number of pages to show around current page
  const range = []
  const rangeWithDots = []

  for (
    let i = Math.max(2, currentPage.value - delta);
    i <= Math.min(totalPages.value - 1, currentPage.value + delta);
    i++
  ) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (currentPage.value + delta < totalPages.value - 1) {
    rangeWithDots.push('...', totalPages.value)
  } else {
    rangeWithDots.push(totalPages.value)
  }

  return range
})

const showFirstPage = computed(() => totalPages.value > 1 && !visiblePages.value.includes(1))
const showLastPage = computed(() => totalPages.value > 1 && !visiblePages.value.includes(totalPages.value))
const showFirstEllipsis = computed(() => visiblePages.value.length > 0 && visiblePages.value[0] > 2)
const showLastEllipsis = computed(() => {
  const lastVisible = visiblePages.value[visiblePages.value.length - 1]
  return visiblePages.value.length > 0 && lastVisible < totalPages.value - 1
})
</script>
