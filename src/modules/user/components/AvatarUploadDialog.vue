<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Upload Avatar"
    width="400px"
  >
    <div v-if="user" class="avatar-upload-container">
      <!-- Current Avatar -->
      <div class="text-center mb-6">
        <div class="mb-3">
          <span class="text-sm text-gray-600">Avatar hiện tại:</span>
        </div>
        <UserAvatar :user="user" size="large" class="mx-auto" />
        <p class="text-sm text-gray-600 mt-2">{{ user.fullName }}</p>
      </div>

      <!-- Upload Area -->
      <div class="upload-section">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :on-change="handleFileChange"
          drag
        >
          <div class="upload-content">
            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
            <div class="text-lg text-gray-600 mb-2">
              Kéo thả file hoặc <span class="text-blue-500">click để chọn</span>
            </div>
            <div class="text-sm text-gray-400">
              Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
            </div>
          </div>
        </el-upload>

        <!-- Preview -->
        <div v-if="previewImage" class="preview-section mt-4">
          <div class="text-sm text-gray-600 mb-2">Xem trước:</div>
          <div class="flex justify-center">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                :src="previewImage" 
                alt="Preview"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- File Info -->
        <div v-if="selectedFile" class="file-info mt-4 p-3 bg-gray-50 rounded">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium">{{ selectedFile.name }}</div>
              <div class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</div>
            </div>
            <el-button 
              type="text" 
              size="small" 
              @click="clearFile"
              class="text-red-500"
            >
              <i class="fas fa-times"></i>
            </el-button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message mt-3 text-sm text-red-500">
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="handleClose">Hủy</el-button>
        <el-button 
          type="primary" 
          @click="handleUpload"
          :disabled="!selectedFile || !!errorMessage"
          :loading="uploading"
        >
          <i class="fas fa-upload mr-2"></i>
          Upload
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
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

// Refs
const uploadRef = ref()
const selectedFile = ref(null)
const previewImage = ref('')
const errorMessage = ref('')
const uploading = ref(false)

// Watch for dialog close
watch(() => props.visible, (visible) => {
  if (!visible) {
    clearFile()
  }
})

// Methods
const handleFileChange = (file) => {
  const rawFile = file.raw
  
  // Validate file type
  if (!rawFile.type.startsWith('image/')) {
    errorMessage.value = 'Vui lòng chọn file hình ảnh'
    return
  }
  
  // Validate file size (5MB)
  if (rawFile.size > 5 * 1024 * 1024) {
    errorMessage.value = 'File không được vượt quá 5MB'
    return
  }
  
  errorMessage.value = ''
  selectedFile.value = rawFile
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(rawFile)
}

const clearFile = () => {
  selectedFile.value = null
  previewImage.value = ''
  errorMessage.value = ''
  uploadRef.value?.clearFiles()
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
</script>

<style scoped>
.avatar-upload-container {
  padding: 20px 0;
}

.upload-section {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s;
}

.upload-section:hover {
  border-color: #409eff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.file-info {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.error-message {
  text-align: center;
  padding: 8px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
}

:deep(.el-upload-dragger) {
  background: transparent;
  border: none;
  width: 100%;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

:deep(.el-dialog__title) {
  color: white;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}
</style>