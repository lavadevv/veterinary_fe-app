<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Mobile card view -->
    <div class="block lg:hidden">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Nhà cung cấp ({{ suppliers.length }})
        </h3>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div 
          v-for="supplier in suppliers" 
          :key="supplier.id"
          class="p-4 hover:bg-gray-50 cursor-pointer"
          @click="$emit('view-detail', supplier.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {{ supplier.supplierName }}
                </h4>
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    supplier.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ supplier.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Mã:</span> {{ supplier.supplierCode }}
              </p>
              
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Quốc gia:</span> {{ supplier.countryOfOrigin }}
              </p>
              
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Liên hệ:</span> {{ supplier.contactPerson }}
              </p>
              
              <div class="flex items-center gap-2 mt-2">
                <PhoneIcon class="h-4 w-4 text-gray-400" />
                <span class="text-sm text-gray-500">{{ supplier.phone }}</span>
              </div>
              
              <div class="flex items-center gap-2">
                <EnvelopeIcon class="h-4 w-4 text-gray-400" />
                <span class="text-sm text-gray-500">{{ supplier.email }}</span>
              </div>
              
              <!-- GMP Info -->
              <div class="mt-2 p-2 bg-gray-50 rounded">
                <p class="text-xs text-gray-600">
                  <span class="font-medium">GMP:</span> {{ supplier.gmpCertificate }}
                </p>
                <p class="text-xs" :class="getGmpExpiryClass(supplier.gmpExpiryDate)">
                  Hết hạn: {{ formatDate(supplier.gmpExpiryDate) }}
                </p>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-col gap-1 ml-4">
              <button
                @click.stop="$emit('edit', supplier.id)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              
              <button
                @click.stop="$emit('toggle-status', supplier)"
                :class="[
                  'p-2 rounded-md',
                  supplier.isActive 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-green-600 hover:bg-green-50'
                ]"
              >
                <component :is="supplier.isActive ? XMarkIcon : CheckIcon" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop table view -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thông tin
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Liên hệ
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chứng chỉ GMP
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="supplier in suppliers" 
            :key="supplier.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="$emit('view-detail', supplier.id)"
          >
            <!-- Supplier Info -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ supplier.supplierName }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ supplier.supplierCode }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ supplier.countryOfOrigin }}
                </div>
                <div v-if="supplier.manufacturerName" class="text-xs text-gray-400 mt-1">
                  NSX: {{ supplier.manufacturerName }}
                </div>
              </div>
            </td>
            
            <!-- Contact Info -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ supplier.contactPerson }}</div>
              <div class="text-sm text-gray-500">{{ supplier.phone }}</div>
              <div class="text-sm text-gray-500">{{ supplier.email }}</div>
            </td>
            
            <!-- GMP Certificate -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ supplier.gmpCertificate }}</div>
              <div 
                class="text-sm"
                :class="getGmpExpiryClass(supplier.gmpExpiryDate)"
              >
                {{ formatDate(supplier.gmpExpiryDate) }}
              </div>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  supplier.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ supplier.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </td>
            
            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click.stop="$emit('edit', supplier.id)"
                  class="text-blue-600 hover:text-blue-900 p-1 rounded"
                  title="Chỉnh sửa"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                
                <button
                  @click.stop="$emit('toggle-status', supplier)"
                  :class="[
                    'p-1 rounded',
                    supplier.isActive 
                      ? 'text-red-600 hover:text-red-900' 
                      : 'text-green-600 hover:text-green-900'
                  ]"
                  :title="supplier.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'"
                >
                  <component :is="supplier.isActive ? XMarkIcon : CheckIcon" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="suppliers.length === 0" class="text-center py-12">
      <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có nhà cung cấp</h3>
      <p class="mt-1 text-sm text-gray-500">
        Bắt đầu bằng cách tạo nhà cung cấp mới.
      </p>
    </div>
  </div>
</template>

<script setup>
import { 
  PencilIcon, 
  XMarkIcon, 
  CheckIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  BuildingOfficeIcon 
} from '@heroicons/vue/24/outline'

defineProps({
  suppliers: {
    type: Array,
    required: true
  }
})

defineEmits(['view-detail', 'edit', 'toggle-status'])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getGmpExpiryClass = (expiryDate) => {
  if (!expiryDate) return 'text-gray-500'
  
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return 'text-red-600 font-medium' // Expired
  } else if (daysUntilExpiry <= 30) {
    return 'text-yellow-600 font-medium' // Expiring soon
  } else {
    return 'text-green-600' // Valid
  }
}
</script>
