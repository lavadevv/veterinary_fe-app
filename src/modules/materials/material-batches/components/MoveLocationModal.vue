<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <form @submit.prevent="handleSubmit">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <ArrowsRightLeftIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Chuyển vị trí lô vật liệu
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Lô: {{ batch?.batchNumber }} - {{ batch?.materialDto?.materialName }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mt-6 space-y-4">
                  <!-- Current Location -->
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-sm">
                      <span class="font-medium text-gray-700">Vị trí hiện tại:</span>
                      <div class="mt-1">
                        <div v-if="batch?.locationDto" class="text-gray-900">
                          {{ batch.locationDto.locationCode }}
                          <span v-if="batch.locationDto.warehouseDto" class="text-gray-600">
                            - {{ batch.locationDto.warehouseDto.warehouseName }}
                          </span>
                        </div>
                        <div v-else class="text-gray-500 italic">Chưa có vị trí</div>
                        
                        <div v-if="batch?.locationDto?.shelf || batch?.locationDto?.floor" class="text-xs text-gray-500 mt-1">
                          <span v-if="batch.locationDto.floor">Tầng {{ batch.locationDto.floor }}</span>
                          <span v-if="batch.locationDto.floor && batch.locationDto.shelf"> - </span>
                          <span v-if="batch.locationDto.shelf">Kệ {{ batch.locationDto.shelf }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- New Location -->
                  <div>
                    <label for="newLocation" class="block text-sm font-medium text-gray-700">
                      Vị trí mới <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1">
                      <Listbox v-model="form.newLocationId">
                        <div class="relative">
                          <ListboxButton 
                            class="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                            :class="{ 
                              'border-red-300 focus:border-red-500 focus:ring-red-500': errors.newLocationId 
                            }"
                          >
                            <span class="block truncate">
                              {{ selectedLocationName || 'Chọn vị trí mới' }}
                            </span>
                            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </ListboxButton>

                          <transition
                            leave-active-class="transition ease-in duration-100"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                          >
                            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              <ListboxOption
                                v-for="location in availableLocations"
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
                                      <span v-if="location.shelf || location.floor">
                                        -
                                        <span v-if="location.floor">Tầng {{ location.floor }}</span>
                                        <span v-if="location.floor && location.shelf">, </span>
                                        <span v-if="location.shelf">Kệ {{ location.shelf }}</span>
                                      </span>
                                    </span>
                                  </div>

                                  <span
                                    v-if="selected"
                                    :class="[
                                      active ? 'text-white' : 'text-blue-600',
                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                    ]"
                                  >
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                  </span>
                                </li>
                              </ListboxOption>
                              
                              <div v-if="!availableLocations.length" class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                                Không có vị trí khả dụng
                              </div>
                            </ListboxOptions>
                          </transition>
                        </div>
                      </Listbox>
                    </div>
                    <p v-if="errors.newLocationId" class="mt-1 text-sm text-red-600">
                      {{ errors.newLocationId }}
                    </p>
                  </div>

                  <!-- Search Locations -->
                  <div>
                    <label for="locationSearch" class="block text-sm font-medium text-gray-700">
                      Tìm kiếm vị trí
                    </label>
                    <div class="mt-1 relative">
                      <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="locationSearch"
                        v-model="locationSearch"
                        type="text"
                        placeholder="Tìm theo mã vị trí, tên kho..."
                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <!-- Move Reason -->
                  <div>
                    <label for="reason" class="block text-sm font-medium text-gray-700">
                      Lý do chuyển vị trí <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1">
                      <textarea
                        id="reason"
                        v-model="form.reason"
                        rows="3"
                        required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        :class="{ 
                          'border-red-300 focus:border-red-500 focus:ring-red-500': errors.reason 
                        }"
                        placeholder="Nhập lý do chuyển vị trí..."
                      />
                    </div>
                    <p v-if="errors.reason" class="mt-1 text-sm text-red-600">
                      {{ errors.reason }}
                    </p>
                  </div>
                </div>

                <div class="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="loading" class="flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                    <span v-else>Chuyển vị trí</span>
                  </button>
                  <button
                    type="button"
                    @click="$emit('close')"
                    :disabled="loading"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
} from '@headlessui/vue'
import {
  ArrowsRightLeftIcon,
  ChevronUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  batch: {
    type: Object,
    default: null
  },
  locations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const locationSearch = ref('')
const form = ref({
  newLocationId: null,
  reason: ''
})
const errors = ref({})

const availableLocations = computed(() => {
  let filtered = props.locations.filter(location => {
    // Exclude current location
    if (location.id === props.batch?.locationDto?.id) {
      return false
    }
    
    // Only show available locations
    return location.isAvailable !== false
  })
  
  // Apply search filter
  if (locationSearch.value.trim()) {
    const search = locationSearch.value.toLowerCase().trim()
    filtered = filtered.filter(location => 
      location.locationCode?.toLowerCase().includes(search) ||
      location.warehouseDto?.warehouseName?.toLowerCase().includes(search) ||
      location.shelf?.toLowerCase().includes(search) ||
      location.floor?.toLowerCase().includes(search)
    )
  }
  
  return filtered
})

const selectedLocationName = computed(() => {
  if (!form.value.newLocationId) return null
  const location = props.locations.find(l => l.id === form.value.newLocationId)
  if (!location) return null
  
  let name = location.locationCode
  if (location.warehouseDto) {
    name += ` - ${location.warehouseDto.warehouseName}`
  }
  return name
})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.newLocationId) {
    errors.value.newLocationId = 'Vui lòng chọn vị trí mới'
  } else if (form.value.newLocationId === props.batch?.locationDto?.id) {
    errors.value.newLocationId = 'Vị trí mới phải khác với vị trí hiện tại'
  }
  
  if (!form.value.reason.trim()) {
    errors.value.reason = 'Lý do chuyển vị trí không được để trống'
  } else if (form.value.reason.trim().length < 10) {
    errors.value.reason = 'Lý do chuyển vị trí phải có ít nhất 10 ký tự'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const data = {
      newLocationId: form.value.newLocationId,
      reason: form.value.reason.trim()
    }
    
    await emit('save', data)
  } catch (error) {
    console.error('Error moving location:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    newLocationId: null,
    reason: ''
  }
  errors.value = {}
  locationSearch.value = ''
}

// Reset form when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})
</script>
