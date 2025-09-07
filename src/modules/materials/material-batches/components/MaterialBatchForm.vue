<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Basic Information -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Thông tin cơ bản</h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Material -->
          <div class="sm:col-span-2">
            <label for="materialId" class="block text-sm font-medium text-gray-700">
              Vật liệu <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <Listbox v-model="form.materialId">
                <div class="relative">
                  <ListboxButton 
                    class="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base min-h-[44px]"
                    :class="{ 
                      'border-red-300 focus:border-red-500 focus:ring-red-500': errors.materialId 
                    }"
                  >
                    <span class="block truncate">
                      {{ selectedMaterialName || 'Chọn vật liệu' }}
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <div class="sticky top-0 bg-white p-3 border-b border-gray-200">
                        <input
                          v-model="materialSearch"
                          type="text"
                          placeholder="Tìm kiếm vật liệu..."
                          class="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[40px]"
                        />
                      </div>
                      
                      <div v-if="loadingMaterials" class="flex items-center justify-center py-4">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-sm text-gray-500">Đang tìm kiếm...</span>
                      </div>
                      
                      <ListboxOption
                        v-for="material in filteredMaterials"
                        :key="material.id"
                        v-slot="{ active, selected }"
                        :value="material.id"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-blue-600 text-white' : 'text-gray-900',
                            'relative cursor-pointer select-none py-2 pl-3 pr-9'
                          ]"
                        >
                          <div class="flex flex-col">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              {{ material.materialCode }} - {{ material.materialName }}
                            </span>
                            <span :class="[active ? 'text-blue-200' : 'text-gray-500', 'text-xs']">
                              {{ getMaterialTypeLabel(material.materialType) }} | {{ material.unitOfMeasure }}
                            </span>
                          </div>

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-blue-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" />
                          </span>
                        </li>
                      </ListboxOption>
                      
                      <div v-if="!loadingMaterials && !filteredMaterials.length" class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                        Không tìm thấy vật liệu nào
                      </div>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
            <p v-if="errors.materialId" class="mt-1 text-sm text-red-600">
              {{ errors.materialId }}
            </p>
          </div>

          <!-- Batch Number -->
          <div>
            <label for="batchNumber" class="block text-sm font-medium text-gray-700">
              Số lô <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="batchNumber"
                v-model="form.batchNumber"
                type="text"
                required
                maxlength="100"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.batchNumber 
                }"
                placeholder="Nhập số lô"
              />
            </div>
            <p v-if="errors.batchNumber" class="mt-1 text-sm text-red-600">
              {{ errors.batchNumber }}
            </p>
          </div>

          <!-- Internal Batch Code -->
          <div>
            <label for="internalBatchCode" class="block text-sm font-medium text-gray-700">
              Mã lô nội bộ
            </label>
            <div class="mt-1">
              <input
                id="internalBatchCode"
                v-model="form.internalBatchCode"
                type="text"
                maxlength="100"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
                placeholder="Nhập mã lô nội bộ"
              />
            </div>
          </div>

          <!-- Manufacturer Batch Number -->
          <div>
            <label for="manufacturerBatchNumber" class="block text-sm font-medium text-gray-700">
              Số lô nhà sản xuất
            </label>
            <div class="mt-1">
              <input
                id="manufacturerBatchNumber"
                v-model="form.manufacturerBatchNumber"
                type="text"
                maxlength="100"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
                placeholder="Nhập số lô nhà sản xuất"
              />
            </div>
          </div>

          <!-- Location -->
          <div>
            <label for="locationId" class="block text-sm font-medium text-gray-700">
              Vị trí lưu trữ
            </label>
            <div class="mt-1">
              <Listbox v-model="form.locationId">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base min-h-[44px]">
                    <span class="block truncate">
                      {{ selectedLocationName || 'Chọn vị trí' }}
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption :value="null" v-slot="{ active, selected }" as="template">
                        <li :class="[active ? 'bg-blue-600 text-white' : 'text-gray-900', 'relative cursor-pointer select-none py-2 pl-3 pr-9']">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            Chưa chọn vị trí
                          </span>
                        </li>
                      </ListboxOption>
                      
                      <ListboxOption
                        v-for="location in locations"
                        :key="location.id"
                        v-slot="{ active, selected }"
                        :value="location.id"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-blue-600 text-white' : 'text-gray-900',
                            'relative cursor-pointer select-none py-2 pl-3 pr-9'
                          ]"
                        >
                          <div class="flex flex-col">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              {{ location.locationCode }}
                            </span>
                            <span :class="[active ? 'text-blue-200' : 'text-gray-500', 'text-xs']">
                              {{ location.warehouseDto?.warehouseName }}
                            </span>
                          </div>

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-blue-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dates -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Thông tin ngày tháng</h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Manufacturing Date -->
          <div>
            <label for="manufacturingDate" class="block text-sm font-medium text-gray-700">
              Ngày sản xuất
            </label>
            <div class="mt-1">
              <input
                id="manufacturingDate"
                v-model="form.manufacturingDate"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
              />
            </div>
          </div>

          <!-- Expiry Date -->
          <div>
            <label for="expiryDate" class="block text-sm font-medium text-gray-700">
              Ngày hết hạn
            </label>
            <div class="mt-1">
              <input
                id="expiryDate"
                v-model="form.expiryDate"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
              />
            </div>
          </div>

          <!-- Received Date -->
          <div>
            <label for="receivedDate" class="block text-sm font-medium text-gray-700">
              Ngày nhận <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="receivedDate"
                v-model="form.receivedDate"
                type="date"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.receivedDate 
                }"
              />
            </div>
            <p v-if="errors.receivedDate" class="mt-1 text-sm text-red-600">
              {{ errors.receivedDate }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quantities and Pricing -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Số lượng và giá cả</h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Received Quantity -->
          <div>
            <label for="receivedQuantity" class="block text-sm font-medium text-gray-700">
              Số lượng nhận <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 relative">
              <input
                id="receivedQuantity"
                v-model="form.receivedQuantity"
                type="number"
                step="0.001"
                min="0.001"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 pr-20 min-h-[44px]"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.receivedQuantity 
                }"
                placeholder="0.000"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">{{ selectedMaterial?.unitOfMeasure || 'đơn vị' }}</span>
              </div>
            </div>
            <p v-if="errors.receivedQuantity" class="mt-1 text-sm text-red-600">
              {{ errors.receivedQuantity }}
            </p>
          </div>

          <!-- Current Quantity -->
          <div>
            <label for="currentQuantity" class="block text-sm font-medium text-gray-700">
              Số lượng hiện tại
            </label>
            <div class="mt-1 relative">
              <input
                id="currentQuantity"
                v-model="form.currentQuantity"
                type="number"
                step="0.001"
                min="0"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 pr-20 min-h-[44px]"
                placeholder="0.000"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">{{ selectedMaterial?.unitOfMeasure || 'đơn vị' }}</span>
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Để trống để sử dụng số lượng nhận
            </p>
          </div>

          <!-- Unit Price -->
          <div>
            <label for="unitPrice" class="block text-sm font-medium text-gray-700">
              Đơn giá
            </label>
            <div class="mt-1 relative">
              <input
                id="unitPrice"
                v-model="form.unitPrice"
                type="number"
                step="0.01"
                min="0"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 pr-16 min-h-[44px]"
                placeholder="0.00"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">VNĐ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Trạng thái</h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Test Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Trạng thái kiểm nghiệm
            </label>
            <div class="mt-1">
              <Listbox v-model="form.testStatus">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base min-h-[44px]">
                    <span class="block truncate">
                      {{ TEST_STATUS_LABELS[form.testStatus] || 'Chọn trạng thái' }}
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption
                        v-for="(label, status) in TEST_STATUS_LABELS"
                        :key="status"
                        v-slot="{ active, selected }"
                        :value="status"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-blue-600 text-white' : 'text-gray-900',
                            'relative cursor-pointer select-none py-2 pl-3 pr-9'
                          ]"
                        >
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            {{ label }}
                          </span>

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-blue-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>

          <!-- Usage Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Trạng thái sử dụng
            </label>
            <div class="mt-1">
              <Listbox v-model="form.usageStatus">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base min-h-[44px]">
                    <span class="block truncate">
                      {{ USAGE_STATUS_LABELS[form.usageStatus] || 'Chọn trạng thái' }}
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption
                        v-for="(label, status) in USAGE_STATUS_LABELS"
                        :key="status"
                        v-slot="{ active, selected }"
                        :value="status"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-blue-600 text-white' : 'text-gray-900',
                            'relative cursor-pointer select-none py-2 pl-3 pr-9'
                          ]"
                        >
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            {{ label }}
                          </span>

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-blue-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents and Testing -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Tài liệu và kiểm nghiệm</h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- COA Number -->
          <div>
            <label for="coaNumber" class="block text-sm font-medium text-gray-700">
              Số COA
            </label>
            <div class="mt-1">
              <input
                id="coaNumber"
                v-model="form.coaNumber"
                type="text"
                maxlength="100"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
                placeholder="Nhập số COA"
              />
            </div>
          </div>

          <!-- Test Report Number -->
          <div>
            <label for="testReportNumber" class="block text-sm font-medium text-gray-700">
              Số báo cáo kiểm nghiệm
            </label>
            <div class="mt-1">
              <input
                id="testReportNumber"
                v-model="form.testReportNumber"
                type="text"
                maxlength="100"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[44px]"
                placeholder="Nhập số báo cáo"
              />
            </div>
          </div>

          <!-- Quarantine Reason -->
          <div class="sm:col-span-2">
            <label for="quarantineReason" class="block text-sm font-medium text-gray-700">
              Lý do cách ly
            </label>
            <div class="mt-1">
              <textarea
                id="quarantineReason"
                v-model="form.quarantineReason"
                rows="3"
                maxlength="1000"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4"
                placeholder="Nhập lý do cách ly (nếu có)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Ghi chú</h3>
        
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">
            Ghi chú thêm
          </label>
          <div class="mt-1">
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              maxlength="2000"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4"
              placeholder="Nhập ghi chú về lô vật liệu..."
            />
          </div>
          <div class="mt-1 text-xs text-gray-500">
            {{ form.notes?.length || 0 }}/2000 ký tự
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        :disabled="loading"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Hủy
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div v-if="loading" class="flex items-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ mode === 'create' ? 'Đang tạo...' : 'Đang cập nhật...' }}
        </div>
        <span v-else>
          {{ mode === 'create' ? 'Tạo lô vật liệu' : 'Cập nhật lô vật liệu' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import {
  ChevronUpDownIcon,
  CheckIcon
} from '@heroicons/vue/20/solid'
import {
  TEST_STATUS_LABELS,
  USAGE_STATUS_LABELS,
  MATERIAL_TYPE_LABELS,
  TEST_STATUS,
  USAGE_STATUS
} from '../constants'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: value => ['create', 'edit'].includes(value)
  },
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const loading = ref(false)
const materials = ref([])
const locations = ref([])
const materialSearch = ref('')
const loadingMaterials = ref(false)
const errors = ref({})

const form = ref({
  materialId: null,
  locationId: null,
  batchNumber: '',
  internalBatchCode: '',
  manufacturerBatchNumber: '',
  manufacturingDate: '',
  expiryDate: '',
  receivedDate: new Date().toISOString().split('T')[0],
  receivedQuantity: null,
  currentQuantity: null,
  unitPrice: null,
  testStatus: 'CHUA_KIEM_NGHIEM',
  usageStatus: 'CHUA_SU_DUNG',
  coaNumber: '',
  testReportNumber: '',
  quarantineReason: '',
  notes: ''
})

const filteredMaterials = computed(() => {
  // Since we're doing server-side search, just return all materials
  return materials.value
})

const selectedMaterial = computed(() => {
  return materials.value.find(m => m.id === form.value.materialId)
})

const selectedMaterialName = computed(() => {
  if (!selectedMaterial.value) return null
  return `${selectedMaterial.value.materialCode} - ${selectedMaterial.value.materialName}`
})

const selectedLocationName = computed(() => {
  const location = locations.value.find(l => l.id === form.value.locationId)
  if (!location) return null
  
  let name = location.locationCode
  if (location.warehouseDto) {
    name += ` - ${location.warehouseDto.warehouseName}`
  }
  return name
})

const getMaterialTypeLabel = (type) => {
  return MATERIAL_TYPE_LABELS[type] || type
}

const loadMaterials = async (keywords = '') => {
  try {
    loadingMaterials.value = true
    const { getMaterials } = await import('../../material/services/material.service')
    const params = { 
      limit: 100, 
      isActive: true,
      start: 0
    }
    
    // Add keywords if provided
    if (keywords.trim()) {
      params.keywords = keywords.trim()
    }
    
    const response = await getMaterials(params)
    if (response.data.success) {
      materials.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('Failed to load materials:', error)
    materials.value = []
  } finally {
    loadingMaterials.value = false
  }
}

const loadLocations = async () => {
  try {
    const { getLocations } = await import('../../location/services/location.service')
    const response = await getLocations({ limit: 100, isAvailable: true })
    if (response.data.success) {
      locations.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('Failed to load locations:', error)
    locations.value = []
  }
}

// Debounced search for materials
const debouncedMaterialSearch = debounce(async (keywords) => {
  await loadMaterials(keywords)
}, 300)

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.materialId) {
    errors.value.materialId = 'Vui lòng chọn vật liệu'
  }
  
  if (!form.value.batchNumber.trim()) {
    errors.value.batchNumber = 'Số lô không được để trống'
  } else if (form.value.batchNumber.trim().length > 100) {
    errors.value.batchNumber = 'Số lô không được vượt quá 100 ký tự'
  }
  
  if (!form.value.receivedDate) {
    errors.value.receivedDate = 'Ngày nhận không được để trống'
  }
  
  if (!form.value.receivedQuantity || parseFloat(form.value.receivedQuantity) <= 0) {
    errors.value.receivedQuantity = 'Số lượng nhận phải lớn hơn 0'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const data = {
      ...form.value,
      // Convert empty strings to null
      internalBatchCode: form.value.internalBatchCode || null,
      manufacturerBatchNumber: form.value.manufacturerBatchNumber || null,
      manufacturingDate: form.value.manufacturingDate || null,
      expiryDate: form.value.expiryDate || null,
      currentQuantity: form.value.currentQuantity || form.value.receivedQuantity,
      unitPrice: form.value.unitPrice || null,
      coaNumber: form.value.coaNumber || null,
      testReportNumber: form.value.testReportNumber || null,
      quarantineReason: form.value.quarantineReason || null,
      notes: form.value.notes || null,
      locationId: form.value.locationId || null
    }
    
    await emit('save', data)
  } catch (error) {
    console.error('Error saving batch:', error)
  } finally {
    loading.value = false
  }
}

// Auto-set current quantity to received quantity
watch(() => form.value.receivedQuantity, (newValue) => {
  if (newValue && !form.value.currentQuantity) {
    form.value.currentQuantity = newValue
  }
})

// Initialize form with data for edit mode
watch(() => props.initialData, (data) => {
  if (data && props.mode === 'edit') {
    form.value = {
      materialId: data.materialDto?.id || null,
      locationId: data.locationDto?.id || null,
      batchNumber: data.batchNumber || '',
      internalBatchCode: data.internalBatchCode || '',
      manufacturerBatchNumber: data.manufacturerBatchNumber || '',
      manufacturingDate: data.manufacturingDate || '',
      expiryDate: data.expiryDate || '',
      receivedDate: data.receivedDate || '',
      receivedQuantity: data.receivedQuantity || null,
      currentQuantity: data.currentQuantity || null,
      unitPrice: data.unitPrice || null,
      testStatus: data.testStatus || 'CHUA_KIEM_NGHIEM',
      usageStatus: data.usageStatus || 'CHUA_SU_DUNG',
      coaNumber: data.coaNumber || '',
      testReportNumber: data.testReportNumber || '',
      quarantineReason: data.quarantineReason || '',
      notes: data.notes || ''
    }
  }
}, { immediate: true })

onMounted(async () => {
  await Promise.all([
    loadMaterials(),
    loadLocations()
  ])
})

// Watch for material search
watch(materialSearch, (newValue) => {
  if (newValue !== undefined) {
    debouncedMaterialSearch(newValue)
  }
})
</script>
