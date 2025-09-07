<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
    <div class="px-3 py-4 sm:px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div class="min-w-0 flex-1">
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Nhật ký hoạt động</h1>
          <p class="mt-1 text-sm sm:text-base text-gray-600">
            Theo dõi và quản lý các hoạt động trong hệ thống
          </p>
        </div>
        <div class="flex-shrink-0">
          <button
            type="button"
            @click="refreshData"
            :disabled="auditStore.isLoading"
            class="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            <svg v-if="auditStore.isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ auditStore.isLoading ? 'Đang tải...' : 'Làm mới' }}
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mt-6 lg:mt-8">
        <div class="bg-white shadow-sm rounded-xl border border-emerald-100 p-4 sm:p-6">
          <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 lg:mb-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Bộ lọc</h3>
            <button
              @click="resetFilters"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Đặt lại
            </button>
          </div>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <!-- Keywords Input -->
            <div class="sm:col-span-2 xl:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Từ khóa</label>
              <div class="relative">
                <input
                  v-model="searchForm.keywords"
                  @input="handleSearch"
                  type="text"
                  placeholder="Tìm kiếm..."
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Action Select -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Loại hoạt động</label>
              <Listbox v-model="searchForm.action" @update:modelValue="handleSearch">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors">
                    <span class="block truncate">{{ searchForm.action || 'Tất cả' }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption
                        v-slot="{ active, selected }"
                        value=""
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                            'relative cursor-pointer select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                            Tất cả
                          </span>
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                      <ListboxOption
                        v-for="action in actionOptions"
                        :key="action"
                        v-slot="{ active, selected }"
                        :value="action"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                            'relative cursor-pointer select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                            {{ action }}
                          </span>
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>

            <!-- Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                v-model="searchForm.startDate"
                @change="handleSearch"
                type="datetime-local"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              />
            </div>

            <!-- End Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                v-model="searchForm.endDate"
                @change="handleSearch"
                type="datetime-local"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              />
            </div>
          </div>

          <!-- Sort Controls -->
          <div class="mt-6 flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <span class="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
              
              <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Listbox v-model="searchForm.sortField" @update:modelValue="handleSearch">
                  <div class="relative">
                    <ListboxButton class="relative w-full sm:w-32 cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                      <span class="block truncate">{{ getSortFieldLabel(searchForm.sortField) }}</span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption
                        v-for="option in sortFieldOptions"
                        :key="option.value"
                        v-slot="{ active, selected }"
                        :value="option.value"
                        as="template"
                      >
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-pointer select-none py-2 pl-3 pr-9']">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                          <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>

                <Listbox v-model="searchForm.sortType" @update:modelValue="handleSearch">
                  <div class="relative">
                    <ListboxButton class="relative w-full sm:w-32 cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                      <span class="block truncate">{{ searchForm.sortType === 'desc' ? 'Giảm dần' : 'Tăng dần' }}</span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption v-slot="{ active, selected }" value="desc" as="template">
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-pointer select-none py-2 pl-3 pr-9']">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">Giảm dần</span>
                          <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                      <ListboxOption v-slot="{ active, selected }" value="asc" as="template">
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-pointer select-none py-2 pl-3 pr-9']">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">Tăng dần</span>
                          <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>
            
            <button
              @click="handleSearch"
              :disabled="auditStore.isLoading"
              class="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="mt-4 lg:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm sm:text-base text-gray-600">
          Tổng số: <span class="font-semibold text-gray-900">{{ auditStore.getTotalElements }}</span> bản ghi
        </div>
        <!-- Debug info -->
        <!-- <div class="text-xs text-red-500 mt-2">
          Debug: {{ auditStore.getPaginatedLogs?.length || 0 }} logs loaded, Loading: {{ auditStore.isLoading }}, Error: {{ auditStore.hasError }}
          <br>Data type: {{ typeof auditStore.getPaginatedLogs }}, Data: {{ JSON.stringify(auditStore.getPaginatedLogs?.slice(0,1)) }}
        </div> -->
      </div>

      <!-- Audit Table -->
      <div class="mt-6 lg:mt-8">
        <div class="bg-white shadow-sm rounded-xl border border-emerald-100 overflow-hidden">
          <!-- Loading State -->
          <div v-if="auditStore.isLoading" class="flex items-center justify-center h-32 sm:h-48 lg:h-64">
            <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <svg class="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-base sm:text-lg text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="auditStore.hasError" class="flex flex-col items-center justify-center h-32 sm:h-48 lg:h-64 p-4">
            <svg class="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 text-center text-sm sm:text-base">Có lỗi xảy ra khi tải dữ liệu</p>
            <button @click="refreshData" class="mt-4 text-emerald-600 hover:text-emerald-700 text-sm sm:text-base">Thử lại</button>
          </div>
          
          <!-- Data Display -->
          <div v-else-if="!auditStore.isLoading && !auditStore.hasError && auditStore.getPaginatedLogs && auditStore.getPaginatedLogs.length > 0">
            <!-- Mobile Card View -->
            <div class="block md:hidden">
              <div class="space-y-4 p-4">
                <div 
                  v-for="audit in auditStore.getPaginatedLogs" 
                  :key="audit.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span class="text-xs font-medium text-emerald-700">
                            {{ getUserInitials(audit.username || audit.userId) }}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ audit.username || audit.userId }}</div>
                        <div class="text-xs text-gray-500">{{ formatTimestamp(audit.timestamp) }}</div>
                      </div>
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          :class="getActionColor(audit.action)">
                      {{ audit.action }}
                    </span>
                  </div>
                  
                  <div class="space-y-2">
                    <div>
                      <span class="text-xs font-medium text-gray-500">Thực thể:</span>
                      <span class="text-sm text-gray-900 ml-1">{{ audit.entityName }}</span>
                    </div>
                    <div>
                      <span class="text-xs font-medium text-gray-500">Mô tả:</span>
                      <p class="text-sm text-gray-900 mt-1">{{ audit.description }}</p>
                    </div>
                    <div class="flex items-center justify-between pt-2">
                      <span class="text-xs font-mono text-gray-500">{{ audit.ipAddress }}</span>
                      <button 
                        @click="showDetails(audit)"
                        class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Desktop Table View -->
            <div class="hidden md:block overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hoạt động
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thực thể
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="audit in auditStore.getPaginatedLogs" :key="audit.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ audit.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatTimestamp(audit.timestamp) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span class="text-sm font-medium text-emerald-700">
                              {{ getUserInitials(audit.username || audit.userId) }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ audit.username || audit.userId }}</div>
                          <div class="text-sm text-gray-500" v-if="audit.userId && audit.username !== audit.userId">{{ audit.userId }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getActionColor(audit.action)">
                        {{ audit.action }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ audit.entityName }}</div>
                        <div class="text-sm text-gray-500" v-if="audit.entityId">ID: {{ audit.entityId }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {{ audit.description }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-mono text-gray-900">{{ audit.ipAddress }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        @click="showDetails(audit)"
                        class="text-emerald-600 hover:text-emerald-900 font-medium"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center h-32 sm:h-48 lg:h-64 p-4">
            <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500 text-sm sm:text-base">Không có dữ liệu audit logs</p>
            <p class="text-xs sm:text-sm text-gray-400 mt-2 text-center">Thử điều chỉnh bộ lọc hoặc thêm dữ liệu mới</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="auditStore.getPaginatedLogs && auditStore.getPaginatedLogs.length > 0" class="mt-6">
        <nav class="bg-white px-4 py-3 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border border-emerald-100 rounded-lg shadow-sm">
          <div class="text-center sm:text-left">
            <p class="text-sm text-gray-700">
              Hiển thị 
              <span class="font-medium">{{ getDisplayStart() }}</span> 
              đến 
              <span class="font-medium">{{ getDisplayEnd() }}</span> 
              của
              <span class="font-medium">{{ auditStore.getTotalElements }}</span> 
              kết quả
            </p>
          </div>
          <div class="flex justify-center sm:justify-end space-x-2">
            <button 
              @click="previousPage"
              :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            
            <!-- Page Numbers -->
            <div class="hidden sm:flex space-x-1">
              <button
                v-for="page in getVisiblePages()"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  page === currentPage
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <!-- Mobile Page Indicator -->
            <div class="flex sm:hidden items-center px-3 py-2 border border-gray-300 rounded-md bg-white">
              <span class="text-sm text-gray-700">{{ currentPage }} / {{ getTotalPages() }}</span>
            </div>
            
            <button 
              @click="nextPage"
              :disabled="currentPage >= getTotalPages()"
              class="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        </nav>
      </div>

      <!-- Detail Dialog -->
      <Dialog v-model:open="detailDialogVisible" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                <DialogTitle class="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                  Chi tiết Audit Log
                </DialogTitle>
                <button
                  @click="detailDialogVisible = false"
                  class="self-end sm:self-auto text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div v-if="selectedLog" class="space-y-4 sm:space-y-6">
                <!-- Basic Info -->
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r-lg">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thông tin cơ bản</h3>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div class="space-y-3 sm:space-y-4">
                      <div>
                        <label class="text-sm font-medium text-gray-500">ID</label>
                        <p class="text-gray-900 font-mono text-sm break-all">{{ selectedLog.id }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-gray-500">Người dùng</label>
                        <p class="text-gray-900">{{ selectedLog.username || selectedLog.userId }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-gray-500">Hành động</label>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              :class="getActionColor(selectedLog.action)">
                          {{ selectedLog.action }}
                        </span>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-gray-500">Thực thể</label>
                        <p class="text-gray-900">{{ selectedLog.entityName }}</p>
                        <p class="text-sm text-gray-500" v-if="selectedLog.entityId">ID: {{ selectedLog.entityId }}</p>
                      </div>
                    </div>
                    <div class="space-y-3 sm:space-y-4">
                      <div>
                        <label class="text-sm font-medium text-gray-500">Thời gian</label>
                        <p class="text-gray-900 text-sm">{{ formatTimestamp(selectedLog.timestamp) }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-gray-500">IP Address</label>
                        <p class="text-gray-900 font-mono text-sm break-all">{{ selectedLog.ipAddress }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-gray-500">Session ID</label>
                        <p class="text-gray-900 font-mono text-sm break-all">{{ selectedLog.sessionId || 'N/A' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-gray-500">Mô tả</label>
                        <p class="text-gray-900 text-sm">{{ selectedLog.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Old Values -->
                <div v-if="selectedLog.oldValues" class="bg-orange-50 border-l-4 border-orange-400 p-4 sm:p-6 rounded-r-lg">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Giá trị cũ</h3>
                  <pre class="bg-white p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-auto max-h-40 sm:max-h-60 border text-gray-800">{{ formatJsonString(selectedLog.oldValues) }}</pre>
                </div>

                <!-- New Values -->
                <div v-if="selectedLog.newValues" class="bg-green-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-r-lg">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Giá trị mới</h3>
                  <pre class="bg-white p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-auto max-h-40 sm:max-h-60 border text-gray-800">{{ formatJsonString(selectedLog.newValues) }}</pre>
                </div>

                <!-- User Agent Details -->
                <div class="bg-purple-50 border-l-4 border-purple-400 p-4 sm:p-6 rounded-r-lg">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thông tin User Agent</h3>
                  <p class="text-xs sm:text-sm text-gray-700 break-all font-mono">{{ selectedLog.userAgent || 'N/A' }}</p>
                </div>
              </div>

              <div class="mt-6 sm:mt-8 flex justify-center sm:justify-end">
                <button
                  @click="detailDialogVisible = false"
                  class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  Listbox, 
  ListboxButton, 
  ListboxOptions, 
  ListboxOption,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { 
  ChevronUpDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { useAuditStore } from '../store/auditStore'

// Store
const auditStore = useAuditStore()

// Reactive data
const searchForm = reactive({
  keywords: '',
  action: '',
  sortField: 'timestamp',
  sortType: 'desc',
  startDate: '',
  endDate: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const selectedLog = ref(null)

// Computed
const actionOptions = computed(() => {
  return ['CREATE', 'UPDATE', 'DELETE', 'READ', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT']
})

const sortFieldOptions = [
  { value: 'timestamp', label: 'Thời gian' },
  { value: 'action', label: 'Hành động' },
  { value: 'username', label: 'Người dùng' },
  { value: 'entityName', label: 'Thực thể' }
]

// Methods
const loadAuditLogs = async (resetPage = false) => {
  try {
    if (resetPage) {
      currentPage.value = 1
    }
    
    console.log('Loading audit logs with params:', {
      page: currentPage.value,
      limit: pageSize.value,
      ...searchForm
    })
    
    await auditStore.fetchAuditLogs({
      page: currentPage.value,
      limit: pageSize.value,
      ...searchForm
    })
    
    console.log('Loaded audit logs:', auditStore.getPaginatedLogs?.length || 0)
    console.log('Total elements:', auditStore.getTotalElements)
  } catch (error) {
    console.error('Error loading audit logs:', error)
  }
}

const handleSearch = () => {
  loadAuditLogs(true)
}

const refreshData = () => {
  loadAuditLogs()
}

const resetFilters = () => {
  Object.assign(searchForm, {
    keywords: '',
    action: '',
    sortField: 'timestamp',
    sortType: 'desc',
    startDate: '',
    endDate: ''
  })
  auditStore.resetFilters()
  loadAuditLogs(true)
}

const showDetails = (log) => {
  selectedLog.value = log
  detailDialogVisible.value = true
}

// Pagination methods
const getTotalPages = () => {
  return Math.ceil(auditStore.getTotalElements / pageSize.value)
}

const getDisplayStart = () => {
  return (currentPage.value - 1) * pageSize.value + 1
}

const getDisplayEnd = () => {
  const end = currentPage.value * pageSize.value
  return Math.min(end, auditStore.getTotalElements)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadAuditLogs()
  }
}

const nextPage = () => {
  if (currentPage.value < getTotalPages()) {
    currentPage.value++
    loadAuditLogs()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  loadAuditLogs()
}

const getVisiblePages = () => {
  const total = getTotalPages()
  const current = currentPage.value
  const delta = 2
  
  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)
  
  if (end - start < 4 && total > 4) {
    if (start === 1) {
      end = Math.min(5, total)
    } else if (end === total) {
      start = Math.max(total - 4, 1)
    }
  }
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

// Utility methods
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getUserInitials = (name) => {
  if (!name) return 'U'
  const words = name.trim().split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

const getActionColor = (action) => {
  const colors = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    READ: 'bg-gray-100 text-gray-800',
    VIEW: 'bg-purple-100 text-purple-800',
    LOGIN: 'bg-emerald-100 text-emerald-800',
    LOGOUT: 'bg-orange-100 text-orange-800',
    EXPORT: 'bg-indigo-100 text-indigo-800',
    IMPORT: 'bg-yellow-100 text-yellow-800'
  }
  return colors[action] || 'bg-gray-100 text-gray-800'
}

const getSortFieldLabel = (value) => {
  const option = sortFieldOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

const formatJsonString = (jsonString) => {
  try {
    if (typeof jsonString === 'string') {
      return JSON.stringify(JSON.parse(jsonString), null, 2)
    }
    return JSON.stringify(jsonString, null, 2)
  } catch (error) {
    return jsonString
  }
}

// Lifecycle
onMounted(() => {
  loadAuditLogs()
})
</script>
