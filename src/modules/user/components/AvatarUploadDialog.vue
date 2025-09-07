<!-- AvatarUploadDialog.vue - Avatar upload dialog with HeadlessUI + TailwindCSS -->
<template>
  <TransitionRoot appear :show="visible" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-white">
                    Upload Avatar
                  </DialogTitle>
                  <button
                    @click="handleClose"
                    class="rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div v-if="user" class="p-6">
                <!-- Current Avatar -->
                <div class="text-center mb-8">
                  <div class="mb-3">
                    <span class="text-sm font-medium text-gray-700">Avatar hiện tại:</span>
                  </div>
                  <UserAvatar :user="user" size="xl" class="mx-auto mb-3" />
                  <p class="text-sm text-gray-600">{{ user.fullName }}</p>
                </div>

                <!-- Upload Area -->
                <div class="space-y-4">
                  <!-- Drag & Drop Zone -->
                  <div
                    @drop="handleDrop"
                    @dragover.prevent
                    @dragenter.prevent
                    :class="[
                      'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                      isDragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
                    ]"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="handleFileSelect"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div class="space-y-3">
                      <div class="mx-auto w-12 h-12 text-gray-400">
                        <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-lg text-gray-600">
                          <span class="font-medium text-emerald-600 hover:text-emerald-500">Chọn file</span>
                          hoặc kéo thả vào đây
                        </p>
                        <p class="text-sm text-gray-500">JPG, PNG, GIF tối đa 5MB</p>
                      </div>
                    </div>
                  </div>

                  <!-- Preview Section -->
                  <Transition name="fade">
                    <div v-if="previewImage" class="bg-gray-50 rounded-lg p-4">
                      <div class="text-sm font-medium text-gray-700 mb-3">Xem trước:</div>
                      <div class="flex justify-center mb-3">
                        <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img 
                            :src="previewImage" 
                            alt="Preview"
                            class="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <!-- File Info -->
                      <div v-if="selectedFile" class="bg-white rounded-md p-3 border">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                              <p class="text-sm font-medium text-gray-900 truncate">{{ selectedFile.name }}</p>
                              <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                            </div>
                          </div>
                          <button
                            @click="clearFile"
                            class="flex-shrink-0 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Transition>

                  <!-- Error Message -->
                  <Transition name="slide-down">
                    <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
                      <div class="flex">
                        <div class="flex-shrink-0">
                          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <p class="text-sm text-red-800">{{ errorMessage }}</p>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex flex-col sm:flex-row-reverse sm:gap-3 gap-2 px-6 py-4 bg-gray-50 border-t">
                <button
                  @click="handleUpload"
                  :disabled="!selectedFile || !!errorMessage || uploading"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="uploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {{ uploading ? 'Đang upload...' : 'Upload' }}
                </button>
                <button
                  @click="handleClose"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Hủy
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import UserAvatar from './UserAvatar.vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible', 'upload'])

// State
const fileInput = ref()
const selectedFile = ref(null)
const previewImage = ref('')
const errorMessage = ref('')
const uploading = ref(false)
const isDragOver = ref(false)

// Watch for dialog close
watch(() => props.visible, (visible) => {
  if (!visible) {
    clearFile()
  }
})

// Methods
const validateFile = (file) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return 'Vui lòng chọn file hình ảnh (JPG, PNG, GIF)'
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'File không được vượt quá 5MB'
  }
  
  return null
}

const processFile = (file) => {
  const error = validateFile(file)
  if (error) {
    errorMessage.value = error
    return
  }
  
  errorMessage.value = ''
  selectedFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const clearFile = () => {
  selectedFile.value = null
  previewImage.value = ''
  errorMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  try {
    uploading.value = true
    emit('upload', selectedFile.value)
  } finally {
    uploading.value = false
  }
}

// Drag and drop handlers
const handleDragEnter = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}
</script>

<style scoped>
/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.3s ease-in;
}

.slide-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>