<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-3 sm:p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <button
            @click="goBack"
            class="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors mb-3 sm:mb-0"
          >
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Quay lại
          </button>
          <div class="text-center sm:text-left">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Audit Log Người dùng</h1>
            <p class="text-gray-600 mt-1 text-sm sm:text-base">Theo dõi hoạt động của người dùng cụ thể</p>
          </div>
        </div>
        <button
          @click="loadUserAuditLogs"
          :disabled="auditStore.isLoading"
          class="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowPathIcon class="w-4 h-4 mr-2" :class="{ 'animate-spin': auditStore.isLoading }" />
          Tải lại
        </button>
      </div>
    </div>

    <!-- User Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-500 truncate">Tổng hoạt động</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ totalLogs }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <PlusIcon class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-500 truncate">Tạo mới</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ getActionCount('CREATE') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <PencilIcon class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-500 truncate">Cập nhật</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ getActionCount('UPDATE') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-500 truncate">Khoảng thời gian</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ getDateRange() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 sm:p-6 mb-6 sm:mb-8">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Action Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hành động</label>
          <Listbox v-model="filterForm.action" @update:modelValue="handleFilter">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors">
                <span class="block truncate">{{ filterForm.action || 'Chọn hành động' }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
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
                    :value="null"
                    as="template"
                  >
                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                        Tất cả hành động
                      </span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                        <CheckIcon class="h-5 w-5" />
                      </span>
                    </li>
                  </ListboxOption>
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="action in uniqueActions"
                    :key="action"
                    :value="action"
                    as="template"
                  >
                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                        {{ action }}
                      </span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                        <CheckIcon class="h-5 w-5" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- Entity Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thực thể</label>
          <Listbox v-model="filterForm.entity" @update:modelValue="handleFilter">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors">
                <span class="block truncate">{{ filterForm.entity || 'Chọn thực thể' }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
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
                    :value="null"
                    as="template"
                  >
                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                        Tất cả thực thể
                      </span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                        <CheckIcon class="h-5 w-5" />
                      </span>
                    </li>
                  </ListboxOption>
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="entity in uniqueEntities"
                    :key="entity"
                    :value="entity"
                    as="template"
                  >
                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                        {{ entity }}
                      </span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                        <CheckIcon class="h-5 w-5" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- Keywords Search -->
        <div class="sm:col-span-2 lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Từ khóa</label>
          <div class="relative">
            <input
              v-model="filterForm.keywords"
              type="text"
              placeholder="Tìm kiếm..."
              @input="handleFilter"
              class="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <button
              v-if="filterForm.keywords"
              @click="filterForm.keywords = ''; handleFilter()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon class="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline View -->
    <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Timeline hoạt động</h3>
        <div class="text-sm text-gray-500">
          Hiển thị {{ filteredLogs.length }} / {{ totalLogs }} bản ghi
        </div>
      </div>

      <!-- Loading -->
      <div v-if="auditStore.isLoading" class="flex flex-col sm:flex-row items-center justify-center py-12 sm:py-20">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mb-3 sm:mb-0"></div>
        <span class="ml-0 sm:ml-3 text-gray-600 text-sm sm:text-base">Đang tải dữ liệu...</span>
      </div>

      <!-- Timeline Content -->
      <div v-else-if="filteredLogs.length > 0" class="timeline-container">
        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
          
          <div 
            v-for="(log, index) in filteredLogs" 
            :key="log.id"
            class="relative flex items-start mb-6 sm:mb-8 last:mb-0"
          >
            <!-- Timeline Marker -->
            <div 
              class="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white relative z-10 shadow-lg border-2 border-white"
              :class="getActionColorClass(log.action)"
            >
              <component :is="getActionIconComponent(log.action)" class="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            <!-- Timeline Content -->
            <div class="ml-4 sm:ml-6 flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 lg:mb-0">
                  <span 
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white mb-1 sm:mb-0 w-fit"
                    :class="getActionColorClass(log.action)"
                  >
                    {{ log.action }}
                  </span>
                  <span class="text-xs sm:text-sm text-gray-500">
                    {{ auditStore.formatTimestamp(log.timestamp) }}
                  </span>
                </div>
                <button 
                  @click="showDetails(log)"
                  class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors w-fit"
                >
                  <EyeIcon class="w-4 h-4 mr-1.5" />
                  Chi tiết
                </button>
              </div>
              
              <div class="space-y-3">
                <h4 class="font-semibold text-gray-900 text-base">{{ log.entityName }}</h4>
                <p class="text-gray-700 text-sm leading-relaxed">{{ log.description }}</p>
                
                <div class="flex flex-wrap gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span class="flex items-center">
                    <MapPinIcon class="w-4 h-4 mr-1.5 text-gray-400" />
                    {{ log.ipAddress }}
                  </span>
                  <span class="flex items-center" v-if="log.sessionId">
                    <KeyIcon class="w-4 h-4 mr-1.5 text-gray-400" />
                    Session: {{ log.sessionId.substring(0, 8) }}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-12 sm:py-20">
        <div class="text-center">
          <DocumentIcon class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
          <h3 class="text-sm sm:text-base font-medium text-gray-900 mb-2">Không có hoạt động nào</h3>
          <p class="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Người dùng này chưa có hoạt động nào được ghi lại trong hệ thống hoặc không có hoạt động nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            v-if="filterForm.action || filterForm.entity || filterForm.keywords"
            @click="resetFilters"
            class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-md hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Dialog -->
    <TransitionRoot appear :show="detailDialogVisible" as="template">
      <Dialog as="div" @close="handleCloseDetail" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-base sm:text-lg font-medium leading-6 text-gray-900 mb-4 sm:mb-6">
                  Chi tiết Audit Log
                </DialogTitle>

                <div v-if="selectedLog" class="space-y-4 sm:space-y-6">
                  <!-- Basic Info -->
                  <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thông tin cơ bản</h4>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div class="space-y-3">
                        <div>
                          <label class="text-sm font-medium text-gray-500">ID</label>
                          <p class="text-gray-900 font-mono text-sm break-all">{{ selectedLog.id }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Người dùng</label>
                          <p class="text-gray-900">{{ selectedLog.username }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Hành động</label>
                          <span 
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                            :style="{ backgroundColor: auditStore.getActionColor(selectedLog.action) }"
                          >
                            {{ selectedLog.action }}
                          </span>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Thực thể</label>
                          <p class="text-gray-900">{{ selectedLog.entityName }}</p>
                        </div>
                      </div>
                      
                      <div class="space-y-3">
                        <div>
                          <label class="text-sm font-medium text-gray-500">Thời gian</label>
                          <p class="text-gray-900 text-sm">{{ auditStore.formatTimestamp(selectedLog.timestamp) }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">IP Address</label>
                          <p class="text-gray-900 font-mono text-sm break-all">{{ selectedLog.ipAddress }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Session ID</label>
                          <p class="text-gray-900 font-mono text-sm break-all">{{ selectedLog.sessionId }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Mô tả</label>
                          <p class="text-gray-900 text-sm">{{ selectedLog.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Old Values -->
                  <div v-if="selectedLog.oldValues" class="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                    <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Giá trị cũ</h4>
                    <pre class="bg-gray-50 p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-auto max-h-40 sm:max-h-60 border">{{ auditStore.formatJsonString(selectedLog.oldValues) }}</pre>
                  </div>

                  <!-- New Values -->
                  <div v-if="selectedLog.newValues" class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Giá trị mới</h4>
                    <pre class="bg-gray-50 p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-auto max-h-40 sm:max-h-60 border">{{ auditStore.formatJsonString(selectedLog.newValues) }}</pre>
                  </div>

                  <!-- User Agent Details -->
                  <div class="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
                    <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thông tin User Agent</h4>
                    <p class="text-xs sm:text-sm text-gray-700 break-all">{{ selectedLog.userAgent }}</p>
                  </div>
                </div>

                <div class="mt-6 flex justify-center sm:justify-end">
                  <button
                    type="button"
                    class="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                    @click="detailDialogVisible = false"
                  >
                    Đóng
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuditStore } from '../store/auditStore';
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  ChevronUpDownIcon,
  CheckIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  CalendarDaysIcon,
  MapPinIcon,
  KeyIcon,
  DocumentIcon,
  TrashIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline';

// Router and Store
const route = useRoute();
const router = useRouter();
const auditStore = useAuditStore();

// Reactive data
const userId = ref(route.params.userId);
const filterForm = reactive({
  action: null,
  entity: null,
  keywords: ''
});

const detailDialogVisible = ref(false);
const selectedLog = ref(null);

// Computed properties
const totalLogs = computed(() => auditStore.userAuditLogs.length);

const uniqueActions = computed(() => {
  const actions = auditStore.userAuditLogs.map(log => log.action);
  return [...new Set(actions)];
});

const uniqueEntities = computed(() => {
  const entities = auditStore.userAuditLogs.map(log => log.entityName);
  return [...new Set(entities)];
});

const filteredLogs = computed(() => {
  let logs = [...auditStore.userAuditLogs];
  console.log('Original logs count:', logs.length);
  
  if (filterForm.action) {
    logs = logs.filter(log => log.action === filterForm.action);
  }
  
  if (filterForm.entity) {
    logs = logs.filter(log => log.entityName === filterForm.entity);
  }
  
  if (filterForm.keywords) {
    const keywords = filterForm.keywords.toLowerCase();
    logs = logs.filter(log => 
      log.description?.toLowerCase().includes(keywords) ||
      log.entityName?.toLowerCase().includes(keywords) ||
      log.username?.toLowerCase().includes(keywords) ||
      log.action?.toLowerCase().includes(keywords)
    );
  }
  
  const result = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  console.log('Filtered logs count:', result.length);
  return result;
});

// Methods
const loadUserAuditLogs = async () => {
  try {
    console.log('Loading audit logs for userId:', userId.value);
    await auditStore.fetchUserAuditLogs(userId.value);
    console.log('Loaded audit logs count:', auditStore.userAuditLogs.length);
  } catch (error) {
    console.error('Error loading user audit logs:', error);
  }
};

const getActionCount = (action) => {
  return auditStore.userAuditLogs.filter(log => log.action === action).length;
};

const getDateRange = () => {
  if (auditStore.userAuditLogs.length === 0) return '---';
  
  const dates = auditStore.userAuditLogs.map(log => new Date(log.timestamp));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  const today = new Date();
  const diffDays = Math.ceil((today - minDate) / (1000 * 60 * 60 * 24));
  
  return `${diffDays} ngày`;
};

const getActionIconComponent = (action) => {
  const iconMap = {
    'CREATE': PlusIcon,
    'UPDATE': PencilIcon,
    'DELETE': TrashIcon,
    'READ': EyeIcon,
    'VIEW': EyeIcon,
    'LOGIN': UserIcon,
    'LOGOUT': ArrowRightOnRectangleIcon,
    'EXPORT': ArrowDownTrayIcon,
    'IMPORT': ArrowUpTrayIcon
  };
  return iconMap[action] || DocumentTextIcon;
};

const getActionColorClass = (action) => {
  const colorMap = {
    'CREATE': 'bg-green-500',
    'UPDATE': 'bg-orange-500',
    'DELETE': 'bg-red-500',
    'READ': 'bg-blue-500',
    'VIEW': 'bg-blue-500',
    'LOGIN': 'bg-purple-500',
    'LOGOUT': 'bg-gray-500',
    'EXPORT': 'bg-indigo-500',
    'IMPORT': 'bg-cyan-500'
  };
  return colorMap[action] || 'bg-gray-500';
};

const handleFilter = () => {
  // Filters are applied automatically through computed property
};

const resetFilters = () => {
  Object.assign(filterForm, {
    action: null,
    entity: null,
    keywords: ''
  });
};

const goBack = () => {
  router.push('/audit');
};

const showDetails = (log) => {
  selectedLog.value = log;
  detailDialogVisible.value = true;
};

const handleCloseDetail = () => {
  detailDialogVisible.value = false;
  selectedLog.value = null;
};

// Lifecycle
onMounted(() => {
  loadUserAuditLogs();
});
</script>

<style scoped>
.timeline-container {
  position: relative;
  min-height: 200px;
}

/* Timeline line improvements */
.timeline-container .absolute.left-4 {
  left: 1rem;
}

.timeline-container .absolute.left-6 {
  left: 1.5rem;
}

/* Timeline item positioning */
.timeline-container .relative .ml-4 {
  margin-left: 1.5rem;
}

.timeline-container .relative .ml-6 {
  margin-left: 2rem;
}

/* Timeline animations */
.timeline-container .relative:nth-child(odd) .bg-white {
  animation: slideInLeft 0.6s ease-out;
}

.timeline-container .relative:nth-child(even) .bg-white {
  animation: slideInRight 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Enhanced hover effects */
.timeline-container .bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Timeline marker enhancements */
.timeline-container .w-8.h-8,
.timeline-container .w-12.h-12 {
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Custom scrollbar for JSON display */
pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

pre::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

pre::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Mobile responsive adjustments */
@media (max-width: 639px) {
  .timeline-container .absolute.left-4 {
    left: 0.75rem;
  }
  
  .timeline-container .ml-4 {
    margin-left: 1.25rem;
  }
  
  .timeline-container .w-8.h-8 {
    width: 2rem;
    height: 2rem;
  }
}

/* Tablet adjustments */
@media (min-width: 640px) and (max-width: 1023px) {
  .timeline-container .absolute.left-6 {
    left: 1.25rem;
  }
  
  .timeline-container .ml-6 {
    margin-left: 1.75rem;
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .timeline-container .bg-white {
    padding: 1.5rem;
  }
  
  .timeline-container .relative:nth-child(even) .bg-white {
    margin-left: 0.5rem;
  }
}

/* Loading state improvements */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Button hover improvements */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Badge styling improvements */
.inline-flex.items-center.px-2\.5.py-1 {
  font-weight: 600;
  letter-spacing: 0.025em;
}
</style>