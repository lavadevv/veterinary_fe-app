<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <!-- Mobile Layout -->
    <div class="block md:hidden p-4">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 truncate">
            {{ material.materialName }}
          </h3>
          <p class="text-xs text-gray-500 mt-1">{{ material.materialCode }}</p>
        </div>
        <div class="flex items-center space-x-2 ml-3">
          <MaterialStatusBadge :is-active="material.isActive" />
          <button 
            @click="$emit('toggle-selection', material.id)"
            class="p-1"
            :class="isSelected ? 'text-blue-600' : 'text-gray-400'"
          >
            <CheckIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="space-y-2 text-xs">
        <div class="flex justify-between">
          <span class="text-gray-500">Loại:</span>
          <MaterialTypeBadge :type="material.materialType" />
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Dạng:</span>
          <MaterialFormBadge :form="material.materialForm" />
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Tồn kho:</span>
          <StockDisplay 
            :current="material.currentStock" 
            :minimum="material.minimumStockLevel"
            :unit="material.unitOfMeasure" 
          />
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Giá:</span>
          <PriceDisplay :price="material.fixedPrice" />
        </div>
        <div class="flex justify-between" v-if="material.supplierDto">
          <span class="text-gray-500">NCC:</span>
          <span class="font-medium text-gray-900 truncate max-w-32">
            {{ material.supplierDto.supplierName }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div class="flex items-center space-x-1">
          <span v-if="material.requiresColdStorage" class="text-blue-500" title="Bảo quản lạnh">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h14V7l-7-5zM10 4.5L15 8v8H5V8l5-3.5z"/>
              <circle cx="10" cy="12" r="2"/>
            </svg>
          </span>
          <span v-if="isLowStock" class="text-amber-500" title="Tồn kho thấp">
            <ExclamationTriangleIcon class="h-4 w-4" />
          </span>
        </div>
        
        <div class="flex items-center space-x-1">
          <button 
            @click="$emit('view', material)"
            class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Xem chi tiết"
          >
            <EyeIcon class="h-4 w-4" />
          </button>
          <button 
            @click="$emit('edit', material)"
            class="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Chỉnh sửa"
          >
            <PencilIcon class="h-4 w-4" />
          </button>
          <button 
            @click="$emit('delete', material.id)"
            class="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Xóa"
          >
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden md:block">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="$emit('toggle-selection', material.id)"
              class="flex-shrink-0"
              :class="isSelected ? 'text-blue-600' : 'text-gray-400'"
            >
              <CheckIcon class="h-5 w-5" />
            </button>
            
            <div class="min-w-0 flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-sm font-semibold text-gray-900 truncate">
                  {{ material.materialName }}
                </h3>
                <MaterialStatusBadge :is-active="material.isActive" />
              </div>
              <div class="flex items-center space-x-4 mt-1">
                <p class="text-sm text-gray-500">{{ material.materialCode }}</p>
                <p class="text-sm text-gray-500" v-if="material.shortName">{{ material.shortName }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-6">
            <div class="text-right">
              <MaterialTypeBadge :type="material.materialType" />
              <MaterialFormBadge :form="material.materialForm" class="mt-1" />
            </div>
            
            <div class="text-right min-w-0">
              <StockDisplay 
                :current="material.currentStock" 
                :minimum="material.minimumStockLevel"
                :unit="material.unitOfMeasure" 
              />
              <PriceDisplay :price="material.fixedPrice" class="mt-1" />
            </div>

            <div class="text-right min-w-0 max-w-40" v-if="material.supplierDto">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ material.supplierDto.supplierName }}
              </p>
              <p class="text-xs text-gray-500">{{ material.supplierDto.supplierCode }}</p>
            </div>

            <div class="flex items-center space-x-2">
              <span v-if="material.requiresColdStorage" class="text-blue-500" title="Bảo quản lạnh">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h14V7l-7-5zM10 4.5L15 8v8H5V8l5-3.5z"/>
                  <circle cx="10" cy="12" r="2"/>
                </svg>
              </span>
              <span v-if="isLowStock" class="text-amber-500" title="Tồn kho thấp">
                <ExclamationTriangleIcon class="h-5 w-5" />
              </span>
            </div>

            <div class="flex items-center space-x-1">
              <button 
                @click="$emit('view', material)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                title="Xem chi tiết"
              >
                <EyeIcon class="h-4 w-4" />
              </button>
              <button 
                @click="$emit('edit', material)"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-md hover:bg-green-50"
                title="Chỉnh sửa"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button 
                @click="$emit('delete', material.id)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                title="Xóa"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  CheckIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'
import MaterialStatusBadge from './MaterialStatusBadge.vue'
import MaterialTypeBadge from './MaterialTypeBadge.vue'
import MaterialFormBadge from './MaterialFormBadge.vue'
import StockDisplay from './StockDisplay.vue'
import PriceDisplay from './PriceDisplay.vue'

const props = defineProps({
  material: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view', 'edit', 'delete', 'toggle-selection'])

const isLowStock = computed(() => {
  return props.material.currentStock <= props.material.minimumStockLevel
})
</script>
