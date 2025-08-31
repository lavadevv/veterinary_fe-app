<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :title="isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'"
    :width="dialogWidth"
    :before-close="handleClose"
    :fullscreen="isMobile"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      @submit.prevent="handleSubmit"
    >
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="Họ và tên" prop="fullName">
            <el-input
              v-model="formData.fullName"
              placeholder="Nhập họ và tên"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="Nhập email"
              clearable
              :disabled="isEdit"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Số điện thoại" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="Nhập số điện thoại"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Vai trò" prop="roleId">
            <el-select
              v-model="formData.roleId"
              placeholder="Chọn vai trò"
              style="width: 100%"
            >
              <el-option
                v-for="role in roles"
                :key="role.value"
                :label="role.label"
                :value="role.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="Địa chỉ" prop="address">
            <el-input
              v-model="formData.address"
              placeholder="Nhập địa chỉ"
              type="textarea"
              :rows="2"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Phòng ban" prop="department">
            <el-input
              v-model="formData.department"
              placeholder="Nhập phòng ban"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Chức vụ" prop="position">
            <el-input
              v-model="formData.position"
              placeholder="Nhập chức vụ"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="!isEdit">
          <el-form-item label="Mật khẩu" prop="password">
            <el-input
              v-model="formData.password"
              placeholder="Nhập mật khẩu"
              type="password"
              show-password
            />
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="isEdit">
          <el-form-item label="Trạng thái">
            <el-switch
              v-model="formData.block"
              active-text="Bị khóa"
              inactive-text="Hoạt động"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="handleClose">Hủy</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="saving"
        >
          {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ROLES, ROLE_LABELS } from '@/modules/auth/constants/roles'

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
const emit = defineEmits(['update:visible', 'save'])

// Refs
const formRef = ref()
const saving = ref(false)
const windowWidth = ref(window.innerWidth)

// Computed
const isEdit = computed(() => !!props.user?.id)

const isMobile = computed(() => windowWidth.value < 768)

const dialogWidth = computed(() => {
  if (windowWidth.value < 640) return '95%'
  if (windowWidth.value < 768) return '80%'
  return '600px'
})

// Form data
const formData = ref({
  id: null,
  fullName: '',
  email: '',
  phone: '',
  address: '',
  department: '',
  position: '',
  roleId: '',
  password: '',
  block: false
})

// Methods
const resetForm = () => {
  formData.value = {
    id: null,
    fullName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    roleId: '',
    password: '',
    block: false
  }
  formRef.value?.resetFields()
}


// Roles options
const roles = ref(
  Object.values(ROLES).map(role => ({
    label: ROLE_LABELS[role],
    value: role
  }))
)

// Form validation rules
const rules = computed(() => ({
  fullName: [
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
    { min: 2, max: 100, message: 'Họ tên phải từ 2-100 ký tự', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: 'Vui lòng chọn vai trò', trigger: 'change' }
  ],
  password: isEdit.value ? [] : [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ]
}))

// Watch for user changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = {
      id: newUser.id,
      fullName: newUser.fullName || '',
      email: newUser.email || '',
      phone: newUser.phone || '',
      address: newUser.address || '',
      department: newUser.department || '',
      position: newUser.position || '',
      roleId: newUser.role?.roleId || '',
      password: '',
      block: newUser.block || false
    }
  } else {
    resetForm()
  }
}, { immediate: true })


// Watch for dialog visibility
watch(() => props.visible, (visible) => {
  if (!visible) {
    resetForm()
  }
}, {immediate: true})



const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    saving.value = true
    
    const submitData = { ...formData.value }
    if (isEdit.value) {
      delete submitData.password // Không gửi password khi update
    }
    
    emit('save', submitData)
  } catch (error) {
    ElMessage.error('Vui lòng kiểm tra lại thông tin')
  } finally {
    saving.value = false
  }
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

:deep(.el-dialog__title) {
  color: white;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  :deep(.el-form-item__label) {
    font-size: 14px;
    margin-bottom: 0.5rem;
  }
  
  :deep(.el-input),
  :deep(.el-select) {
    width: 100%;
  }
  
  :deep(.el-dialog__body) {
    padding: 1rem;
  }
  
  :deep(.el-dialog__footer) {
    padding: 1rem;
  }
  
  :deep(.el-button) {
    min-width: 80px;
  }
}

@media (max-width: 640px) {
  :deep(.el-form) {
    padding: 0;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 1rem;
  }
  
  :deep(.el-dialog__header) {
    padding: 1rem;
  }
  
  :deep(.el-dialog__footer) {
    text-align: center;
  }
  
  :deep(.el-dialog__footer .flex) {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  :deep(.el-button) {
    width: 100%;
  }
}
</style>