<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.back()"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ isEdit ? 'Chỉnh sửa giao dịch' : 'Tạo giao dịch mới' }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                {{ isEdit ? 'Cập nhật thông tin giao dịch vật liệu' : 'Tạo giao dịch vật liệu mới trong hệ thống' }}
              </p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              <ArrowPathIcon class="w-4 h-4 mr-2" />
              Đặt lại
            </button>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="loading || !isFormValid"
              class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <template v-if="loading">
                <div class="flex items-center">
                  <div class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {{ isEdit ? 'Đang cập nhật...' : 'Đang tạo...' }}
                </div>
              </template>
              <template v-else>
                <CheckIcon class="w-4 h-4 mr-2" />
                {{ isEdit ? 'Cập nhật' : 'Tạo giao dịch' }}
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex">
      <!-- Left Sidebar - Form Steps/Info -->
      <div class="w-80 bg-white border-r border-gray-200 min-h-screen">
        <div class="p-6">
          <!-- Progress Steps -->
          <div class="mb-8">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Tiến trình tạo giao dịch</h3>
            <div class="space-y-3">
              <div
                v-for="(step, index) in formSteps"
                :key="step.id"
                :class="[
                  'flex items-center p-3 rounded-lg border transition-all',
                  currentStep >= index + 1
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50'
                ]"
              >
                <div
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3',
                    currentStep >= index + 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <p
                    :class="[
                      'text-sm font-medium',
                      currentStep >= index + 1 ? 'text-emerald-900' : 'text-gray-600'
                    ]"
                  >
                    {{ step.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-900">Thông tin nhanh</h3>
            
            <!-- Selected Batch Info -->
            <div v-if="selectedBatch" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="text-sm font-medium text-blue-900 mb-2">Lô được chọn</h4>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-blue-700">Mã lô:</span>
                  <span class="font-medium text-blue-900">{{ selectedBatch.batchNumber || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Vật liệu:</span>
                  <span class="font-medium text-blue-900">{{ selectedBatch.materialDto?.materialName || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Số lượng khả dụng:</span>
                  <span class="font-medium text-blue-900">{{ selectedBatch.currentQuantity || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Đơn vị:</span>
                  <span class="font-medium text-blue-900">{{ selectedBatch.materialDto?.unitOfMeasure || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Kho:</span>
                  <span class="font-medium text-blue-900">{{ selectedBatch.locationDto?.warehouseDto?.warehouseName || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Transaction Summary -->
            <div v-if="formData.transactionType" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Tóm tắt giao dịch</h4>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-600">Loại:</span>
                  <span class="font-medium text-gray-900">{{ transactionTypeOptions[formData.transactionType] || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Số lượng:</span>
                  <span class="font-medium text-gray-900">{{ formData.quantity || 0 }}</span>
                </div>
                <div v-if="formData.fromLocationId" class="flex justify-between">
                  <span class="text-gray-600">Từ vị trí:</span>
                  <span class="font-medium text-gray-900 text-right">{{ getLocationName(formData.fromLocationId) }}</span>
                </div>
                <div v-if="formData.toLocationId" class="flex justify-between">
                  <span class="text-gray-600">Đến vị trí:</span>
                  <span class="font-medium text-gray-900 text-right">{{ getLocationName(formData.toLocationId) }}</span>
                </div>
              </div>
            </div>

            <!-- Validation Status -->
            <div class="p-4 rounded-lg border" :class="isFormValid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'">
              <div class="flex items-center">
                <component
                  :is="isFormValid ? CheckCircleIcon : ExclamationTriangleIcon"
                  :class="[
                    'w-5 h-5 mr-2',
                    isFormValid ? 'text-green-600' : 'text-yellow-600'
                  ]"
                />
                <h4 :class="['text-sm font-medium', isFormValid ? 'text-green-900' : 'text-yellow-900']">
                  {{ isFormValid ? 'Form hợp lệ' : 'Cần kiểm tra' }}
                </h4>
              </div>
              <p :class="['text-xs mt-1', isFormValid ? 'text-green-700' : 'text-yellow-700']">
                {{ isFormValid ? 'Tất cả thông tin đã được điền đầy đủ' : 'Vui lòng kiểm tra các trường bắt buộc' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Content -->
      <div class="flex-1">
        <form @submit.prevent="handleSubmit" class="p-8">
          <div class="max-w-4xl mx-auto space-y-8">
            
            <!-- Step 1: Transaction Type -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center mb-6">
                <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  1
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Loại giao dịch</h3>
                  <p class="text-sm text-gray-500">Chọn loại giao dịch bạn muốn thực hiện</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  v-for="(label, type) in transactionTypeOptions"
                  :key="type"
                  type="button"
                  :class="[
                    'p-4 text-left border rounded-lg transition-all duration-200 hover:shadow-md',
                    formData.transactionType === type
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="selectTransactionType(type)"
                >
                  <div class="flex flex-col items-center text-center space-y-2">
                    <component
                      :is="getTypeIcon(type)"
                      :class="[
                        'w-8 h-8',
                        formData.transactionType === type ? 'text-emerald-600' : 'text-gray-400'
                      ]"
                    />
                    <span :class="['text-sm font-medium', formData.transactionType === type ? 'text-emerald-900' : 'text-gray-700']">
                      {{ label }}
                    </span>
                  </div>
                </button>
              </div>
              
              <p v-if="errors.transactionType" class="mt-3 text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                {{ errors.transactionType }}
              </p>
            </div>

            <!-- Step 2: Material Batch Selection -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center mb-6">
                <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  2
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Chọn lô vật liệu</h3>
                  <p class="text-sm text-gray-500">Tìm và chọn lô vật liệu cho giao dịch</p>
                </div>
              </div>

              <!-- Batch Selection Listbox -->
              <div class="relative">
                <Listbox :model-value="selectedBatch" @update:model-value="selectBatch">
                  <div class="relative">
                    <ListboxButton
                      class="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <div v-if="selectedBatch" class="flex items-center justify-between">
                        <div>
                          <span class="block truncate font-medium">{{ selectedBatch.batchNumber || 'N/A' }}</span>
                          <span class="block truncate text-sm text-gray-600">{{ selectedBatch.materialDto?.materialName || 'N/A' }}</span>
                        </div>
                        <div class="text-right">
                          <div class="text-sm font-medium text-emerald-600">
                            {{ selectedBatch.currentQuantity || 0 }} {{ selectedBatch.materialDto?.unitOfMeasure || '' }}
                          </div>
                          <div class="text-xs text-gray-500">Khả dụng</div>
                        </div>
                      </div>
                      <span v-else class="block truncate text-gray-400">Chọn lô vật liệu...</span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>

                    <transition
                      leave-active-class="transition duration-100 ease-in"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0"
                    >
                      <ListboxOptions
                        class="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <!-- Search Input in Dropdown -->
                        <div class="sticky top-0 bg-white p-2 border-b border-gray-200">
                          <div class="relative">
                            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              v-model="batchSearchQuery"
                              type="text"
                              placeholder="Tìm kiếm lô vật liệu..."
                              class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              @click.stop
                            />
                          </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="filteredBatches.length === 0" class="relative cursor-default select-none py-4 px-4 text-gray-700 text-center">
                          <div class="text-sm">Không tìm thấy lô vật liệu</div>
                          <div class="text-xs text-gray-500 mt-1">Thử thay đổi từ khóa tìm kiếm</div>
                        </div>

                        <!-- Batch Options -->
                        <ListboxOption
                          v-for="batch in filteredBatches"
                          :key="batch.id"
                          :value="batch"
                          as="template"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                              selected ? 'bg-emerald-50 border-l-4 border-emerald-500' : '',
                              'relative cursor-pointer select-none py-3 px-4 border-b border-gray-100 last:border-b-0'
                            ]"
                          >
                            <div class="flex items-center justify-between">
                              <div class="flex-1 min-w-0">
                                <div class="flex items-center space-x-3">
                                  <div :class="[
                                    'w-2 h-2 rounded-full flex-shrink-0',
                                    selected ? 'bg-emerald-500' : 'bg-gray-300'
                                  ]"></div>
                                  <div class="min-w-0 flex-1">
                                    <p :class="[
                                      'text-sm font-medium truncate',
                                      selected ? 'text-emerald-900' : 'text-gray-900'
                                    ]">
                                      {{ batch.batchNumber || 'N/A' }}
                                    </p>
                                    <p :class="[
                                      'text-xs truncate',
                                      selected ? 'text-emerald-700' : 'text-gray-600'
                                    ]">
                                      {{ batch.materialDto?.materialName || 'N/A' }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div class="text-right flex-shrink-0 ml-3">
                                <div :class="[
                                  'text-sm font-medium',
                                  selected ? 'text-emerald-900' : 'text-gray-900'
                                ]">
                                  {{ batch.currentQuantity || 0 }}
                                </div>
                                <div :class="[
                                  'text-xs',
                                  selected ? 'text-emerald-700' : 'text-gray-500'
                                ]">
                                  {{ batch.materialDto?.unitOfMeasure || '' }}
                                </div>
                              </div>
                            </div>
                            
                            <!-- Additional Info -->
                            <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div class="flex justify-between">
                                <span :class="selected ? 'text-emerald-600' : 'text-gray-500'">Kho:</span>
                                <span :class="[
                                  'font-medium truncate ml-1 text-right max-w-32',
                                  selected ? 'text-emerald-800' : 'text-gray-700'
                                ]" :title="batch.locationDto?.warehouseDto?.address">
                                  {{ batch.locationDto?.warehouseDto?.warehouseCode }} - {{ batch.locationDto?.warehouseDto?.warehouseName }}
                                </span>
                              </div>
                              <div class="flex justify-between">
                                <span :class="selected ? 'text-emerald-600' : 'text-gray-500'">Trạng thái:</span>
                                <span :class="[
                                  'text-xs px-2 py-1 rounded-full font-medium',
                                  batch.testStatus === 'DAT' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                ]">
                                  {{ batch.testStatus === 'DAT' ? 'Đạt' : 'Chưa test' }}
                                </span>
                              </div>
                            </div>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>
              
              <p v-if="errors.materialBatchId" class="mt-3 text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                {{ errors.materialBatchId }}
              </p>
            </div>

            <!-- Step 3: Transaction Details -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center mb-6">
                <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  3
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Chi tiết giao dịch</h3>
                  <p class="text-sm text-gray-500">Nhập thông tin chi tiết cho giao dịch</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Quantity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng *
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="formData.quantity"
                      type="number"
                      min="0"
                      :max="selectedBatch?.currentQuantity || 0"
                      step="0.01"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Nhập số lượng"
                    />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      {{ selectedBatch?.materialDto?.unitOfMeasure || '' }}
                    </div>
                  </div>
                  <p v-if="selectedBatch" class="mt-1 text-xs text-gray-500">
                    Tối đa: {{ selectedBatch.currentQuantity || 0 }} {{ selectedBatch.materialDto?.unitOfMeasure || '' }}
                  </p>
                  <p v-if="errors.quantity" class="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                    {{ errors.quantity }}
                  </p>
                </div>

                <!-- Unit Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Đơn giá
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="formData.unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Nhập đơn giá"
                    />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      VNĐ
                    </div>
                  </div>
                </div>

                <!-- From Location (for transfer/out) -->
                <div v-if="showFromWarehouse">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Từ vị trí * ({{ locations.length }} vị trí khả dụng)
                  </label>
                  <select
                    v-model="formData.fromLocationId"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Chọn vị trí nguồn</option>
                    <option
                      v-for="location in locations"
                      :key="location.id"
                      :value="location.id"
                    >
                      {{ location.locationCode }} - {{ location.positionDetail }} ({{ location.warehouseDto?.warehouseCode }})
                    </option>
                  </select>
                  <p v-if="errors.fromLocationId" class="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                    {{ errors.fromLocationId }}
                  </p>
                </div>

                <!-- To Location (for transfer/in) -->
                <div v-if="showToWarehouse">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Đến vị trí * ({{ availableDestinationLocations.length }} vị trí khả dụng)
                  </label>
                  <select
                    v-model="formData.toLocationId"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Chọn vị trí đích</option>
                    <option
                      v-for="location in availableDestinationLocations"
                      :key="location.id"
                      :value="location.id"
                    >
                      {{ location.locationCode }} - {{ location.positionDetail }} ({{ location.warehouseDto?.warehouseCode }})
                    </option>
                  </select>
                  <p v-if="errors.toLocationId" class="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                    {{ errors.toLocationId }}
                  </p>
                </div>

                <!-- Transaction Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ngày giao dịch *
                  </label>
                  <input
                    v-model="formData.transactionDate"
                    type="datetime-local"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                  <p v-if="errors.transactionDate" class="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                    {{ errors.transactionDate }}
                  </p>
                </div>

                <!-- Reference Document -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Số chứng từ
                  </label>
                  <input
                    v-model="formData.referenceDocument"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Nhập số chứng từ..."
                    maxlength="100"
                  />
                </div>

                <!-- Production Order ID -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Mã đơn sản xuất
                  </label>
                  <input
                    v-model="formData.productionOrderId"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Nhập mã đơn sản xuất..."
                    maxlength="50"
                  />
                </div>

                <!-- Reason -->
                <div class="lg:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Lý do
                  </label>
                  <textarea
                    v-model="formData.reason"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Nhập lý do thực hiện giao dịch..."
                    maxlength="500"
                  ></textarea>
                </div>

                <!-- Notes -->
                <div class="lg:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    v-model="formData.notes"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Nhập ghi chú cho giao dịch..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Total Summary -->
            <div v-if="formData.quantity && formData.unitPrice" class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 p-6">
              <h3 class="text-lg font-medium text-emerald-900 mb-4">Tổng kết giao dịch</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-white rounded-lg">
                  <div class="text-2xl font-bold text-emerald-600">{{ formData.quantity || 0 }}</div>
                  <div class="text-sm text-gray-600">Số lượng ({{ selectedBatch?.material?.unit || '' }})</div>
                </div>
                <div class="text-center p-4 bg-white rounded-lg">
                  <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(formData.unitPrice || 0) }}</div>
                  <div class="text-sm text-gray-600">Đơn giá</div>
                </div>
                <div class="text-center p-4 bg-white rounded-lg">
                  <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(totalAmount) }}</div>
                  <div class="text-sm text-gray-600">Tổng tiền</div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Listbox, 
  ListboxButton, 
  ListboxOptions, 
  ListboxOption 
} from '@headlessui/vue'
import { useMaterialTransactionStore } from '../store/materialTransactionStore'
import { useMaterialBatchStore } from '../../material-batches/store/materialBatchStore'
import { useWarehouseStore } from '../../warehouse/store/warehouseStore'
import { useLocationStore } from '../../location/store/locationStore'
import StatusBadge from '../components/StatusBadge.vue'
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowLeftOnRectangleIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  ChevronUpDownIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  transactionId: {
    type: [String, Number],
    default: null
  }
})

// Composables
const router = useRouter()
const route = useRoute()
const transactionStore = useMaterialTransactionStore()
const batchStore = useMaterialBatchStore()
const warehouseStore = useWarehouseStore()
const locationStore = useLocationStore()

// State
const loading = ref(false)
const batchSearchQuery = ref('')
const currentStep = ref(1)

// Check if editing
const isEdit = computed(() => !!props.transactionId || !!route.params.id)

// Form data
const formData = ref({
  transactionType: '',
  materialBatchId: '',
  quantity: null,
  unitPrice: null,
  fromLocationId: '',
  toLocationId: '',
  transactionDate: new Date().toISOString().slice(0, 16),
  referenceDocument: '',
  productionOrderId: '',
  reason: '',
  notes: ''
})

// Form errors
const errors = ref({})

// Form steps
const formSteps = ref([
  {
    id: 'type',
    title: 'Loại giao dịch',
    description: 'Chọn loại giao dịch'
  },
  {
    id: 'batch',
    title: 'Lô vật liệu',
    description: 'Chọn lô vật liệu'
  },
  {
    id: 'details',
    title: 'Chi tiết',
    description: 'Nhập thông tin chi tiết'
  }
])

// Transaction type options
const transactionTypeOptions = {
  NHAP_KHO: 'Nhập kho',
  XUAT_KHO: 'Xuất kho',
  DIEU_CHINH: 'Điều chỉnh kiểm kê',
  TRA_HANG: 'Trả hàng',
  HUY_BO: 'Hủy bỏ'
}

// Computed
const filteredBatches = computed(() => {
  if (!Array.isArray(batchStore.materialBatches)) return []
  
  let batches = batchStore.materialBatches.filter(batch => 
    batch && 
    batch.testStatus === 'DAT' && 
    batch.usageStatus === 'SAN_SANG_SU_DUNG' &&
    (batch.currentQuantity || 0) > 0
  )
  
  if (batchSearchQuery.value) {
    const query = batchSearchQuery.value.toLowerCase()
    batches = batches.filter(batch =>
      (batch.batchNumber || '').toLowerCase().includes(query) ||
      (batch.materialDto?.materialName || '').toLowerCase().includes(query) ||
      (batch.materialDto?.materialCode || '').toLowerCase().includes(query)
    )
  }
  
  return batches
})

const selectedBatch = computed(() => {
  if (!formData.value.materialBatchId || !Array.isArray(batchStore.materialBatches)) return null
  return batchStore.materialBatches.find(batch => batch && batch.id === formData.value.materialBatchId) || null
})

const warehouses = computed(() => {
  const warehouseList = Array.isArray(warehouseStore.warehouses) ? warehouseStore.warehouses : []
  console.log('Warehouses computed:', warehouseList.length, warehouseList)
  return warehouseList
})

const locations = computed(() => {
  const locationList = Array.isArray(locationStore.locations) ? locationStore.locations : []
  console.log('Locations computed:', locationList.length, locationList)
  return locationList
})

const availableDestinationLocations = computed(() => {
  if (!Array.isArray(locations.value)) return []
  
  // For transfer, exclude the source location
  if (formData.value.transactionType === 'DIEU_CHINH' && formData.value.fromLocationId) {
    const filtered = locations.value.filter(l => l && l.id !== formData.value.fromLocationId)
    console.log('Available destination locations (filtered):', filtered.length, filtered)
    return filtered
  }
  
  console.log('Available destination locations (all):', locations.value.length, locations.value)
  return locations.value
})

const showFromWarehouse = computed(() => {
  const show = ['XUAT_KHO', 'TRA_HANG'].includes(formData.value.transactionType)
  console.log('showFromWarehouse:', { transactionType: formData.value.transactionType, show })
  return show
})

const showToWarehouse = computed(() => {
  const show = ['NHAP_KHO'].includes(formData.value.transactionType)
  console.log('showToWarehouse:', { transactionType: formData.value.transactionType, show })
  return show
})

const totalAmount = computed(() => {
  return (formData.value.quantity || 0) * (formData.value.unitPrice || 0)
})

const isFormValid = computed(() => {
  return (
    formData.value.transactionType &&
    formData.value.materialBatchId &&
    formData.value.quantity &&
    formData.value.quantity > 0 &&
    formData.value.transactionDate &&
    (!showFromWarehouse.value || formData.value.fromLocationId) &&
    (!showToWarehouse.value || formData.value.toLocationId)
  )
})

// Methods
const getTypeIcon = (type) => {
  switch (type) {
    case 'NHAP_KHO': return ArrowRightIcon
    case 'XUAT_KHO': return ArrowLeftOnRectangleIcon
    case 'DIEU_CHINH': return PlusIcon
    case 'TRA_HANG': return ArrowsRightLeftIcon
    case 'HUY_BO': return PlusIcon
    default: return PlusIcon
  }
}

const getWarehouseName = (warehouseId) => {
  if (!warehouseId || !Array.isArray(warehouses.value)) {
    console.log('getWarehouseName: Invalid params', { warehouseId, warehousesCount: warehouses.value?.length })
    return 'N/A'
  }
  const warehouse = warehouses.value.find(w => w && w.id === warehouseId)
  if (!warehouse) return 'N/A'
  
  // Return detailed warehouse info
  return `${warehouse.warehouseCode} - ${warehouse.warehouseName}`
}

const getLocationName = (locationId) => {
  if (!locationId || !Array.isArray(locations.value)) {
    console.log('getLocationName: Invalid params', { locationId, locationsCount: locations.value?.length })
    return 'N/A'
  }
  const location = locations.value.find(l => l && l.id === locationId)
  if (!location) return 'N/A'
  
  // Return detailed location info
  return `${location.locationCode} - ${location.positionDetail} (${location.warehouseDto?.warehouseCode || 'N/A'})`
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatCurrency = (amount) => {
  if (!amount) return '0 VNĐ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const selectTransactionType = (type) => {
  formData.value.transactionType = type
  
  // Reset related fields when type changes
  formData.value.fromLocationId = ''
  formData.value.toLocationId = ''
  
  // Auto-set location based on selected batch
  if (selectedBatch.value) {
    if (type === 'XUAT_KHO' || type === 'TRA_HANG') {
      formData.value.fromLocationId = selectedBatch.value.locationDto?.id || ''
    }
  }
  
  updateStep()
}

const selectBatch = (batch) => {
  if (!batch) return
  
  formData.value.materialBatchId = batch.id
  
  // Auto-set price from batch
  if (batch.unitPrice) {
    formData.value.unitPrice = batch.unitPrice
  }
  
  // Auto-set source location for XUAT_KHO/TRA_HANG
  if (['XUAT_KHO', 'TRA_HANG'].includes(formData.value.transactionType)) {
    formData.value.fromLocationId = batch.locationDto?.id || ''
  }
  
  updateStep()
}

const updateStep = () => {
  if (formData.value.transactionType && formData.value.materialBatchId) {
    currentStep.value = 3
  } else if (formData.value.transactionType) {
    currentStep.value = 2
  } else {
    currentStep.value = 1
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.transactionType) {
    errors.value.transactionType = 'Vui lòng chọn loại giao dịch'
  }
  
  if (!formData.value.materialBatchId) {
    errors.value.materialBatchId = 'Vui lòng chọn lô vật liệu'
  }
  
  if (!formData.value.quantity || formData.value.quantity <= 0) {
    errors.value.quantity = 'Vui lòng nhập số lượng hợp lệ'
  } else if (selectedBatch.value && formData.value.quantity > selectedBatch.value.currentQuantity) {
    errors.value.quantity = 'Số lượng vượt quá số lượng khả dụng'
  }
  
  if (!formData.value.transactionDate) {
    errors.value.transactionDate = 'Vui lòng chọn ngày giao dịch'
  }
  
  if (showFromWarehouse.value && !formData.value.fromLocationId) {
    errors.value.fromLocationId = 'Vui lòng chọn vị trí nguồn'
  }
  
  if (showToWarehouse.value && !formData.value.toLocationId) {
    errors.value.toLocationId = 'Vui lòng chọn vị trí đích'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    loading.value = true
    
    // Map frontend data to backend API format
    const submitData = {
      materialBatchId: formData.value.materialBatchId,
      transactionType: formData.value.transactionType,
      transactionDate: formData.value.transactionDate,
      quantity: formData.value.quantity,
      unitPrice: formData.value.unitPrice || 0,
      totalValue: totalAmount.value,
      referenceDocument: formData.value.referenceDocument || null,
      productionOrderId: formData.value.productionOrderId || null,
      fromLocationId: formData.value.fromLocationId || null,
      toLocationId: formData.value.toLocationId || null,
      reason: formData.value.reason || null,
      notes: formData.value.notes || null,
      approvedById: null
    }
    
    if (isEdit.value) {
      const id = props.transactionId || route.params.id
      await transactionStore.updateTransaction(id, submitData)
    } else {
      await transactionStore.createTransaction(submitData)
    }
    
    router.push({ name: 'MaterialTransactionList' })
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    transactionType: '',
    materialBatchId: '',
    quantity: null,
    unitPrice: null,
    fromLocationId: '',
    toLocationId: '',
    transactionDate: new Date().toISOString().slice(0, 16),
    referenceDocument: '',
    productionOrderId: '',
    reason: '',
    notes: ''
  }
  errors.value = {}
  batchSearchQuery.value = ''
  currentStep.value = 1
}

// Load data on mount
onMounted(async () => {
  try {
    loading.value = true
    
    // Load necessary data
    const results = await Promise.all([
      batchStore.fetchMaterialBatches(),
      warehouseStore.fetchWarehouses(),
      locationStore.fetchLocations()
    ])
    
    // Debug data
    console.log('Batches loaded:', batchStore.materialBatches?.length || 0)
    console.log('Raw warehouse store:', warehouseStore)
    console.log('Warehouses loaded:', warehouseStore.warehouses?.length || 0)
    console.log('Warehouses data:', warehouseStore.warehouses)
    
    // Load transaction data if editing
    if (isEdit.value) {
      const id = props.transactionId || route.params.id
      const transaction = await transactionStore.fetchTransactionById(id)
      
      if (transaction) {
        console.log('Loading transaction for edit:', transaction)
        formData.value = {
          transactionType: transaction.transactionType || '',
          materialBatchId: transaction.materialBatchDto?.id || transaction.materialBatchId || '',
          quantity: transaction.quantity || null,
          unitPrice: transaction.unitPrice || null,
          fromLocationId: transaction.fromLocationDto?.id || transaction.fromLocationId || '',
          toLocationId: transaction.toLocationDto?.id || transaction.toLocationId || '',
          transactionDate: transaction.transactionDate ? 
            new Date(transaction.transactionDate).toISOString().slice(0, 16) : 
            new Date().toISOString().slice(0, 16),
          referenceDocument: transaction.referenceDocument || '',
          productionOrderId: transaction.productionOrderId || '',
          reason: transaction.reason || '',
          notes: transaction.notes || ''
        }
        updateStep()
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})

// Watch for form changes to update step
watch([() => formData.value.transactionType, () => formData.value.materialBatchId], () => {
  updateStep()
})
</script>
