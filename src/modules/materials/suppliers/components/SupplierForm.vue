<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Basic Information -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
        <p class="mt-1 text-sm text-gray-500">Nhập thông tin cơ bản của nhà cung cấp</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Supplier Code -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Mã nhà cung cấp <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.supplierCode"
            type="text"
            required
            maxlength="50"
            :class="[
              'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.supplierCode ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            ]"
            placeholder="Ví dụ: SUPP-20250906-001"
          />
          <p v-if="errors.supplierCode" class="text-sm text-red-600 flex items-center gap-1">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.supplierCode }}
          </p>
        </div>

        <!-- Supplier Name -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Tên nhà cung cấp <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.supplierName"
            type="text"
            required
            maxlength="255"
            :class="[
              'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.supplierName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            ]"
            placeholder="Ví dụ: Công ty Dược phẩm ABC"
          />
          <p v-if="errors.supplierName" class="text-sm text-red-600 flex items-center gap-1">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.supplierName }}
          </p>
        </div>

        <!-- Manufacturer Name -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Tên nhà sản xuất
          </label>
          <input
            v-model="form.manufacturerName"
            type="text"
            maxlength="255"
            class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
            placeholder="Ví dụ: Nhà máy Dược phẩm XYZ"
          />
        </div>

        <!-- Distributor Name -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Tên nhà phân phối
          </label>
          <input
            v-model="form.distributorName"
            type="text"
            maxlength="255"
            class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
            placeholder="Ví dụ: Phân phối Dược phẩm DEF"
          />
        </div>

        <!-- Country of Origin -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Quốc gia xuất xứ
          </label>
          <input
            v-model="form.countryOfOrigin"
            type="text"
            maxlength="100"
            class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
            placeholder="Ví dụ: Việt Nam, Hoa Kỳ, Nhật Bản"
          />
        </div>

        <!-- Registration Number -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Số đăng ký kinh doanh
          </label>
          <input
            v-model="form.registrationNumber"
            type="text"
            maxlength="100"
            class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
            placeholder="Ví dụ: 0123456789"
          />
        </div>
      </div>

      <!-- Address (Full width) -->
      <div class="mt-6 space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Địa chỉ
        </label>
        <textarea
          v-model="form.address"
          rows="3"
          class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 resize-none"
          placeholder="Nhập địa chỉ đầy đủ của nhà cung cấp..."
        ></textarea>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Thông tin liên hệ</h3>
        <p class="mt-1 text-sm text-gray-500">Thông tin để liên hệ với nhà cung cấp</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Contact Person -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Người liên hệ
          </label>
          <input
            v-model="form.contactPerson"
            type="text"
            maxlength="255"
            class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
            placeholder="Ví dụ: Nguyễn Văn A"
          />
        </div>

        <!-- Phone -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            v-model="form.phone"
            type="tel"
            maxlength="20"
            :class="[
              'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            ]"
            placeholder="Ví dụ: +84 912 345 678"
          />
          <p v-if="errors.phone" class="text-sm text-red-600 flex items-center gap-1">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.phone }}
          </p>
        </div>
      </div>

      <!-- Email (Full width) -->
      <div class="mt-6 space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Địa chỉ Email
        </label>
        <input
          v-model="form.email"
          type="email"
          maxlength="100"
          :class="[
            'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
          ]"
          placeholder="Ví dụ: contact@example.com"
        />
        <p v-if="errors.email" class="text-sm text-red-600 flex items-center gap-1">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ errors.email }}
        </p>
      </div>
    </div>

    <!-- GMP Certificate -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Chứng chỉ GMP</h3>
        <p class="mt-1 text-sm text-gray-500">Thông tin chứng chỉ GMP (Good Manufacturing Practice)</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- GMP Certificate -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Số chứng chỉ GMP
          </label>
          <input
            v-model="form.gmpCertificate"
            type="text"
            maxlength="100"
            class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
            placeholder="Ví dụ: GMP-WHO-2025-001"
          />
        </div>

        <!-- GMP Expiry Date -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Ngày hết hạn chứng chỉ GMP
          </label>
          <input
            v-model="form.gmpExpiryDate"
            type="date"
            :min="today"
            :class="[
              'w-full px-4 py-3 rounded-lg border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.gmpExpiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            ]"
          />
          <p v-if="errors.gmpExpiryDate" class="text-sm text-red-600 flex items-center gap-1">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.gmpExpiryDate }}
          </p>
        </div>
      </div>
    </div>

    <!-- Status and Notes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Trạng thái và ghi chú</h3>
        <p class="mt-1 text-sm text-gray-500">Cài đặt trạng thái hoạt động và ghi chú bổ sung</p>
      </div>
      
      <!-- Active Status (only for edit mode) -->
      <div v-if="isEditMode" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label class="flex items-start gap-3">
          <input
            v-model="form.isActive"
            type="checkbox"
            class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <div>
            <span class="text-sm font-medium text-gray-700">Nhà cung cấp đang hoạt động</span>
            <p class="text-xs text-gray-500 mt-1">Bỏ tick để tạm ngừng hoạt động của nhà cung cấp này</p>
          </div>
        </label>
      </div>

      <!-- Notes -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Ghi chú bổ sung
        </label>
        <textarea
          v-model="form.notes"
          rows="4"
          class="w-full px-4 py-3 rounded-lg border-gray-300 border shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 resize-none"
          placeholder="Nhập ghi chú về nhà cung cấp (tùy chọn)..."
        ></textarea>
      </div>
    </div>

    <!-- Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div class="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <button
          type="button"
          @click="$emit('cancel')"
          class="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Hủy bỏ
        </button>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div class="flex items-center justify-center gap-2">
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isEditMode ? 'Cập nhật nhà cung cấp' : 'Tạo nhà cung cấp mới' }}</span>
          </div>
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = computed(() => !!props.initialData?.id)

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const form = reactive({
  supplierCode: '',
  supplierName: '',
  manufacturerName: '',
  distributorName: '',
  address: '',
  registrationNumber: '',
  phone: '',
  email: '',
  contactPerson: '',
  gmpCertificate: '',
  gmpExpiryDate: null,
  countryOfOrigin: '',
  isActive: true,
  notes: ''
})

const errors = ref({})

// Initialize form with data
onMounted(() => {
  if (props.initialData) {
    Object.assign(form, {
      supplierCode: props.initialData.supplierCode || '',
      supplierName: props.initialData.supplierName || '',
      manufacturerName: props.initialData.manufacturerName || '',
      distributorName: props.initialData.distributorName || '',
      address: props.initialData.address || '',
      registrationNumber: props.initialData.registrationNumber || '',
      phone: props.initialData.phone || '',
      email: props.initialData.email || '',
      contactPerson: props.initialData.contactPerson || '',
      gmpCertificate: props.initialData.gmpCertificate || '',
      gmpExpiryDate: props.initialData.gmpExpiryDate || null,
      countryOfOrigin: props.initialData.countryOfOrigin || '',
      isActive: props.initialData.isActive !== undefined ? props.initialData.isActive : true,
      notes: props.initialData.notes || ''
    })
  }
})

const validateForm = () => {
  const newErrors = {}

  // Required fields
  if (!form.supplierCode.trim()) {
    newErrors.supplierCode = 'Mã nhà cung cấp không được để trống'
  } else if (form.supplierCode.length > 50) {
    newErrors.supplierCode = 'Mã nhà cung cấp không được vượt quá 50 ký tự'
  }

  if (!form.supplierName.trim()) {
    newErrors.supplierName = 'Tên nhà cung cấp không được để trống'
  } else if (form.supplierName.length > 255) {
    newErrors.supplierName = 'Tên nhà cung cấp không được vượt quá 255 ký tự'
  }

  // Phone validation
  if (form.phone && !/^[0-9+\-\s()]+$/.test(form.phone)) {
    newErrors.phone = 'Số điện thoại không hợp lệ'
  } else if (form.phone && form.phone.length > 20) {
    newErrors.phone = 'Số điện thoại không được vượt quá 20 ký tự'
  }

  // Email validation
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Định dạng email không hợp lệ'
  } else if (form.email && form.email.length > 100) {
    newErrors.email = 'Email không được vượt quá 100 ký tự'
  }

  // GMP expiry date validation
  if (form.gmpExpiryDate && new Date(form.gmpExpiryDate) <= new Date()) {
    newErrors.gmpExpiryDate = 'Ngày hết hạn chứng chỉ GMP phải là ngày trong tương lai'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  const submitData = { ...form }
  
  // For edit mode, include the ID
  if (isEditMode.value) {
    submitData.id = props.initialData.id
  }

  emit('submit', submitData)
}
</script>
