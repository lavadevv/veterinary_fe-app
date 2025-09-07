<!-- UserDialog.vue - User create/edit dialog with HeadlessUI + TailwindCSS -->
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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-white">
                    {{ title || (isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới') }}
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
              <form @submit.prevent="handleSubmit" class="p-6">
                <div class="space-y-6">
                  <!-- Personal Information -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h4>
                    
                    <div class="grid grid-cols-1 gap-4">
                      <!-- Full Name -->
                      <div>
                        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          v-model="formData.fullName"
                          type="text"
                          placeholder="Nhập họ và tên"
                          :class="[
                            'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500',
                            errors.fullName ? 'border-red-300' : 'border-gray-300'
                          ]"
                        />
                        <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
                      </div>

                      <!-- Email -->
                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                          Email <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          v-model="formData.email"
                          type="email"
                          placeholder="Nhập email"
                          :disabled="isEdit"
                          :class="[
                            'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500',
                            isEdit && 'bg-gray-50 cursor-not-allowed',
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          ]"
                        />
                        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                      </div>

                      <!-- Phone & Role -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                          </label>
                          <input
                            id="phone"
                            v-model="formData.phone"
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            :class="[
                              'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500',
                              errors.phone ? 'border-red-300' : 'border-gray-300'
                            ]"
                          />
                          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
                        </div>

                        <div>
                          <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò <span class="text-red-500">*</span>
                          </label>
                          <Listbox v-model="formData.roleId">
                            <div class="relative">
                              <ListboxButton :class="[
                                'relative w-full cursor-default rounded-md border py-2 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500',
                                errors.roleId ? 'border-red-300' : 'border-gray-300'
                              ]">
                                <span class="block truncate">{{ getRoleLabel(formData.roleId) || 'Chọn vai trò' }}</span>
                                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </ListboxButton>

                              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <ListboxOption
                                    v-for="role in roles"
                                    :key="role.value"
                                    v-slot="{ active, selected }"
                                    :value="role.value"
                                    as="template"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ role.label }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </transition>
                            </div>
                          </Listbox>
                          <p v-if="errors.roleId" class="mt-1 text-sm text-red-600">{{ errors.roleId }}</p>
                        </div>
                      </div>

                      <!-- Address -->
                      <div>
                        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ
                        </label>
                        <textarea
                          id="address"
                          v-model="formData.address"
                          rows="2"
                          placeholder="Nhập địa chỉ"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        ></textarea>
                      </div>

                      <!-- Department & Position -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="department" class="block text-sm font-medium text-gray-700 mb-1">
                            Phòng ban
                          </label>
                          <input
                            id="department"
                            v-model="formData.department"
                            type="text"
                            placeholder="Nhập phòng ban"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label for="position" class="block text-sm font-medium text-gray-700 mb-1">
                            Chức vụ
                          </label>
                          <input
                            id="position"
                            v-model="formData.position"
                            type="text"
                            placeholder="Nhập chức vụ"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Security Section -->
                  <div v-if="!isEdit" class="border-t pt-6">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Bảo mật</h4>
                    
                    <div>
                      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          id="password"
                          v-model="formData.password"
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Nhập mật khẩu"
                          :class="[
                            'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500',
                            errors.password ? 'border-red-300' : 'border-gray-300'
                          ]"
                        />
                        <button
                          type="button"
                          @click="showPassword = !showPassword"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                          <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                    </div>
                  </div>

                  <!-- Status Section for Edit -->
                  <div v-if="isEdit" class="border-t pt-6">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Trạng thái</h4>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-900">Trạng thái tài khoản</label>
                        <p class="text-sm text-gray-500">Quyết định xem người dùng có thể đăng nhập hay không</p>
                      </div>
                      <Switch
                        v-model="formData.block"
                        :class="formData.block ? 'bg-red-600' : 'bg-gray-200'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full"
                      >
                        <span class="sr-only">Khóa tài khoản</span>
                        <span
                          :class="formData.block ? 'translate-x-6' : 'translate-x-1'"
                          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        />
                      </Switch>
                    </div>
                    <p class="mt-2 text-sm" :class="formData.block ? 'text-red-600' : 'text-green-600'">
                      {{ formData.block ? 'Tài khoản bị khóa' : 'Tài khoản hoạt động' }}
                    </p>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="flex flex-col sm:flex-row-reverse sm:gap-3 gap-2 mt-8 pt-6 border-t">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
                  </button>
                  <button
                    type="button"
                    @click="handleClose"
                    class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
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
  ListboxOption,
  ListboxOptions,
  Switch
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
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
  },
  title: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:visible', 'save'])

// State
const saving = ref(false)
const showPassword = ref(false)
const errors = ref({})

// Computed
const isEdit = computed(() => !!props.user?.id)

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

// Roles options
const roles = ref(
  Object.values(ROLES).map(role => ({
    label: ROLE_LABELS[role],
    value: role
  }))
)

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
  errors.value = {}
}

const getRoleLabel = (roleId) => {
  const role = roles.value.find(r => r.value === roleId)
  return role ? role.label : ''
}

const validateForm = () => {
  errors.value = {}
  
  // Full name validation
  if (!formData.value.fullName.trim()) {
    errors.value.fullName = 'Vui lòng nhập họ và tên'
  } else if (formData.value.fullName.trim().length < 2 || formData.value.fullName.trim().length > 100) {
    errors.value.fullName = 'Họ tên phải từ 2-100 ký tự'
  }
  
  // Email validation
  if (!formData.value.email.trim()) {
    errors.value.email = 'Vui lòng nhập email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email không hợp lệ'
  }
  
  // Phone validation
  if (formData.value.phone && !/^[0-9+\-\s()]+$/.test(formData.value.phone)) {
    errors.value.phone = 'Số điện thoại không hợp lệ'
  }
  
  // Role validation
  if (!formData.value.roleId) {
    errors.value.roleId = 'Vui lòng chọn vai trò'
  }
  
  // Password validation (only for create)
  if (!isEdit.value) {
    if (!formData.value.password) {
      errors.value.password = 'Vui lòng nhập mật khẩu'
    } else if (formData.value.password.length < 6) {
      errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    saving.value = true
    
    const submitData = { ...formData.value }
    if (isEdit.value) {
      delete submitData.password // Không gửi password khi update
    }
    
    emit('save', submitData)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    saving.value = false
  }
}

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
})
</script>