<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Chi tiết lô vật liệu
              </h1>
              <p class="text-sm sm:text-base text-gray-600 mt-1">
                Thông tin chi tiết về lô {{ batch.batchNumber }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <button
              @click="goToEdit"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105"
            >
              <PencilIcon class="w-4 h-4 mr-2" />
              Chỉnh sửa
            </button>
          
            <button
              v-if="canUpdateQuantity"
              @click="showUpdateQuantityModal = true"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <ScaleIcon class="w-4 h-4 mr-2" />
              Cập nhật số lượng
            </button>
          
            <button
              v-if="canMove"
              @click="showMoveLocationModal = true"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <ArrowsRightLeftIcon class="w-4 h-4 mr-2" />
              Chuyển vị trí
            </button>
          
            <button
              v-if="canUpdateStatus"
              @click="showUpdateStatusModal = true"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <CogIcon class="w-4 h-4 mr-2" />
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Basic Information Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Vật liệu</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">
                      <div class="flex flex-col">
                        <span>{{ batch.materialDto?.materialName || batch.materialDto?.name }}</span>
                        <span class="text-xs text-gray-500 font-mono">{{ batch.materialDto?.materialCode }}</span>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã lô</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.batchNumber }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã lô nội bộ</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.internalBatchCode || 'Chưa có' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã lô nhà sản xuất</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.manufacturerBatchNumber || 'Chưa có' }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Quantity Information -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin số lượng</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Số lượng nhập</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">
                      {{ formatNumber(batch.receivedQuantity) }} {{ batch.materialDto?.unitOfMeasure }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Số lượng hiện tại</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">
                      {{ formatNumber(batch.currentQuantity) }} {{ batch.materialDto?.unitOfMeasure }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Đơn giá</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">
                      {{ formatCurrency(batch.unitPrice) }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Date Information -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin ngày tháng</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ngày sản xuất</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.manufacturingDate) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ngày hết hạn</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.expiryDate) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ngày nhập kho</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.receivedDate) }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Material Information -->
            <div v-if="batch.materialDto" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Thông tin vật liệu</h3>
                    <p class="text-sm text-gray-600">Chi tiết về vật liệu được sử dụng</p>
                  </div>
                </div>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Tên vật liệu</dt>
                    <dd class="text-base text-gray-900 font-semibold">{{ batch.materialDto.materialName || 'Chưa có tên' }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Mã vật liệu</dt>
                    <dd class="text-base text-gray-900 font-mono bg-white px-2 py-1 rounded border">{{ batch.materialDto.materialCode || 'Chưa có mã' }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Tên ngắn</dt>
                    <dd class="text-base text-gray-900">{{ batch.materialDto.shortName || 'Chưa có' }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Loại vật liệu</dt>
                    <dd class="text-base text-gray-900">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ getMaterialTypeLabel(batch.materialDto.materialType) }}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Dạng vật liệu</dt>
                    <dd class="text-base text-gray-900">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {{ getMaterialFormLabel(batch.materialDto.materialForm) }}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Đơn vị đo</dt>
                    <dd class="text-base text-gray-900 font-semibold">{{ batch.materialDto.unitOfMeasure || 'Chưa có' }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4" v-if="batch.materialDto.color">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Màu sắc</dt>
                    <dd class="text-base text-gray-900">{{ batch.materialDto.color }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4" v-if="batch.materialDto.specifications">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Thông số kỹ thuật</dt>
                    <dd class="text-sm text-gray-900">{{ batch.materialDto.specifications }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4" v-if="batch.materialDto.description">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Mô tả</dt>
                    <dd class="text-sm text-gray-900">{{ batch.materialDto.description }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4" v-if="batch.materialDto.hazardLevel">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Mức độ nguy hiểm</dt>
                    <dd class="text-base text-gray-900">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {{ batch.materialDto.hazardLevel }}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4" v-if="batch.materialDto.requiresColdStorage !== undefined">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Yêu cầu bảo quản lạnh</dt>
                    <dd class="text-base text-gray-900">
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        batch.materialDto.requiresColdStorage ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      ]">
                        {{ batch.materialDto.requiresColdStorage ? 'Có' : 'Không' }}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4 col-span-full" v-if="batch.materialDto.notes">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Ghi chú vật liệu</dt>
                    <dd class="text-sm text-gray-900">{{ batch.materialDto.notes }}</dd>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4 col-span-full" v-if="batch.materialDto.specialHandling">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Xử lý đặc biệt</dt>
                    <dd class="text-sm text-gray-900">{{ batch.materialDto.specialHandling }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Supplier Information -->
            <div v-if="batch.materialDto?.supplierDto" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin nhà cung cấp</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Tên nhà cung cấp</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ batch.materialDto.supplierDto.supplierName }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã nhà cung cấp</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.materialDto.supplierDto.supplierCode }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Người liên hệ</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.contactPerson }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Điện thoại</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.phone }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.email }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Quốc gia xuất xứ</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.countryOfOrigin }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Nhà sản xuất</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.manufacturerName }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Nhà phân phối</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.distributorName || 'Chưa có' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Chứng chỉ GMP</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.materialDto.supplierDto.gmpCertificate }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ngày hết hạn GMP</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.materialDto.supplierDto.gmpExpiryDate) }}</dd>
                  </div>
                  <div v-if="batch.materialDto.supplierDto.address" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Địa chỉ</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.address }}</dd>
                  </div>
                  <div v-if="batch.materialDto.supplierDto.notes" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Ghi chú</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.notes }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Test Information -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin kiểm nghiệm</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Số báo cáo kiểm nghiệm</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.testReportNumber || 'Chưa có' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Số COA</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.coaNumber || 'Chưa có' }}</dd>
                  </div>
                  <div v-if="batch.testResults" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Kết quả kiểm nghiệm</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.testResults }}</dd>
                  </div>
                  <div v-if="batch.quarantineReason" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Lý do cách ly</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.quarantineReason }}</dd>
                  </div>
                  <div v-if="batch.notes" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Ghi chú</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.notes }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Status Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Trạng thái</h3>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Trạng thái kiểm nghiệm</dt>
                  <dd class="mt-1">
                    <StatusBadge :status="batch.testStatus" type="test" />
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Trạng thái sử dụng</dt>
                  <dd class="mt-1">
                    <StatusBadge :status="batch.usageStatus" type="usage" />
                  </dd>
                </div>
              </div>
            </div>

            <!-- Location Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Vị trí lưu trữ</h3>
              </div>
              <div class="p-6">
                <div v-if="batch.locationDto" class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã vị trí</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.locationDto.locationCode }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Kho</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ batch.locationDto.warehouseDto?.warehouseName }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã kho</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.locationDto.warehouseDto?.warehouseCode }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Tầng/Kệ</dt>
                    <dd class="mt-1 text-sm text-gray-900">Tầng {{ batch.locationDto.floor }} - Kệ {{ batch.locationDto.shelf }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Công suất</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ formatNumber(batch.locationDto.currentCapacity) }} / {{ formatNumber(batch.locationDto.maxCapacity) }}
                      <span class="text-xs text-gray-500 ml-1">
                        ({{ Math.round((batch.locationDto.currentCapacity / batch.locationDto.maxCapacity) * 100) }}%)
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Nhiệt độ</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.warehouseDto?.temperatureRange }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Độ ẩm</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.warehouseDto?.humidityRange }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Người quản lý</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.warehouseDto?.managerName }}</dd>
                  </div>
                  <div v-if="batch.locationDto.positionDetail">
                    <dt class="text-sm font-medium text-gray-500">Chi tiết vị trí</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.positionDetail }}</dd>
                  </div>
                  <div v-if="batch.locationDto.warehouseDto?.specialConditions">
                    <dt class="text-sm font-medium text-gray-500">Điều kiện đặc biệt</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.warehouseDto.specialConditions }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Trạng thái</dt>
                    <dd class="mt-1">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="batch.locationDto.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ batch.locationDto.isAvailable ? 'Khả dụng' : 'Không khả dụng' }}
                      </span>
                    </dd>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500">
                  Chưa có vị trí
                </div>
              </div>
            </div>

            <!-- Expiry Alert -->
            <ExpiryAlert v-if="batch.expiryDate" :expiry-date="batch.expiryDate" />
          </div>
        </div>

        <!-- Update Quantity Modal -->
        <UpdateQuantityModal
          :show="showUpdateQuantityModal"
          :batch="batch"
          @close="showUpdateQuantityModal = false"
          @save="handleSaveQuantity"
        />

        <!-- Move Location Modal -->
        <MoveLocationModal
          :show="showMoveLocationModal"
          :batch="batch"
          :locations="locations"
          @close="showMoveLocationModal = false"
          @save="handleSaveLocation"
        />

        <!-- Update Status Modal -->
        <UpdateStatusModal
          :show="showUpdateStatusModal"
          :batch="batch"
          @close="showUpdateStatusModal = false"
          @save="handleSaveStatus"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ArrowLeftIcon,
  PencilIcon,
  ScaleIcon,
  ArrowsRightLeftIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

import { useMaterialBatchStore } from '../store/materialBatchStore'
import { MATERIAL_TYPE_LABELS, MATERIAL_FORM_LABELS } from '../constants/materialBatchConstants'
import { getLocations } from '@/modules/materials/location/services/location.service'
import StatusBadge from '../components/StatusBadge.vue'
import ExpiryAlert from '../components/ExpiryAlert.vue'
import UpdateQuantityModal from '../components/UpdateQuantityModal.vue'
import MoveLocationModal from '../components/MoveLocationModal.vue'
import UpdateStatusModal from '../components/UpdateStatusModal.vue'

const route = useRoute()
const router = useRouter()

// Store
const materialBatchStore = useMaterialBatchStore()
const { loading, error } = storeToRefs(materialBatchStore)

// Local state
const batch = ref(null)
const locations = ref([])
const showUpdateQuantityModal = ref(false)
const showMoveLocationModal = ref(false)
const showUpdateStatusModal = ref(false)

// Computed properties
const canUpdateQuantity = computed(() => {
  return batch.value && batch.value.usageStatus === 'SAN_SANG'
})

const canMove = computed(() => {
  return batch.value && batch.value.usageStatus !== 'DA_SU_DUNG'
})

const canUpdateStatus = computed(() => {
  return batch.value
})

// Methods
const loadBatch = async () => {
  try {
    const batchData = await materialBatchStore.fetchMaterialBatchById(route.params.id)
    batch.value = batchData
  } catch (error) {
    console.error('Failed to load batch:', error)
  }
}

const loadLocations = async () => {
  try {
    // Sử dụng location service để đảm bảo đồng nhất
    const response = await getLocations()
    
    // Kiểm tra response có phải HTML không
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.warn('Location API returned HTML instead of JSON, using empty array')
      locations.value = []
      return
    }
    
    // API trả về với cấu trúc {success: true, data: {total: x, items: [...]}}
    if (response.data?.success && response.data?.data?.items && Array.isArray(response.data.data.items)) {
      locations.value = response.data.data.items
    } else if (response.data?.items && Array.isArray(response.data.items)) {
      // Fallback: {total: x, items: [...]}
      locations.value = response.data.items
    } else if (Array.isArray(response.data)) {
      // Fallback: data là array trực tiếp
      locations.value = response.data
    } else {
      console.warn('Unexpected response structure:', response.data)
      locations.value = []
    }
  } catch (error) {
    console.error('Error loading locations:', error)
    // Fallback: set empty array if locations API fails
    locations.value = []
  }
}

const goBack = () => {
  router.push({ name: 'MaterialBatchList' })
}

const goToEdit = () => {
  router.push({ 
    name: 'MaterialBatchEdit', 
    params: { id: batch.value.id } 
  })
}

const handleSaveQuantity = async (quantityData) => {
  try {
    const updatedBatch = await materialBatchStore.updateMaterialBatchQuantity(batch.value.id, quantityData)
    batch.value = updatedBatch
    showUpdateQuantityModal.value = false
  } catch (error) {
    console.error('Failed to update quantity:', error)
  }
}

const handleSaveLocation = async (locationData) => {
  try {
    // Tạm thời comment để tránh error, cần implement function này trong store
    // const updatedBatch = await materialBatchStore.moveMaterialBatchLocation(batch.value.id, locationData)
    // batch.value = updatedBatch
    console.warn('Move location function not implemented in store yet')
    showMoveLocationModal.value = false
  } catch (error) {
    console.error('Failed to move location:', error)
  }
}

const handleSaveStatus = async (statusData) => {
  try {
    let updatedBatch
    if (statusData.type === 'test') {
      updatedBatch = await materialBatchStore.updateMaterialBatchTestStatus(batch.value.id, statusData)
    } else {
      updatedBatch = await materialBatchStore.updateMaterialBatchUsageStatus(batch.value.id, statusData)
    }
    batch.value = updatedBatch
    showUpdateStatusModal.value = false
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const formatNumber = (number) => {
  if (!number && number !== 0) return 'N/A'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleDateString('vi-VN')
}

const getMaterialTypeLabel = (type) => {
  return MATERIAL_TYPE_LABELS[type] || type || 'Chưa có'
}

const getMaterialFormLabel = (form) => {
  return MATERIAL_FORM_LABELS[form] || form || 'Chưa có'
}

onMounted(async () => {
  await Promise.all([
    loadBatch(),
    loadLocations()
  ])
})
</script>
