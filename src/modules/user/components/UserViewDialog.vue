<!-- UserViewDialog.vue - User view dialog with HeadlessUI + TailwindCSS -->
<template>
  <TransitionRoot appear :show="visible" as="template">
    <Dialog as="div" @close="$emit('update:visible', false)" class="relative z-50">
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
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-white">
                    Chi tiết người dùng
                  </DialogTitle>
                  <button
                    @click="$emit('update:visible', false)"
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
                <!-- Avatar & Basic Info -->
                <div class="text-center mb-8">
                  <div class="mb-4">
                    <UserAvatar :user="user" size="xl" />
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ user.fullName }}</h3>
                  <p class="text-gray-600 mb-3">{{ user.email }}</p>
                  <span :class="getStatusBadgeClasses()" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                    <svg :class="user.block ? 'text-red-400' : 'text-green-400'" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="user.block" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    {{ user.block ? 'Bị khóa' : 'Hoạt động' }}
                  </span>
                </div>

                <!-- User Information Grid -->
                <div class="space-y-4">
                  <!-- ID -->
                  <div class="flex items-center py-3 border-b border-gray-100">
                    <div class="flex items-center w-8 h-8 bg-gray-100 rounded-lg mr-3">
                      <svg class="w-4 h-4 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">ID</p>
                      <p class="text-sm text-gray-900 font-mono">#{{ user.id }}</p>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="flex items-center py-3 border-b border-gray-100">
                    <div class="flex items-center w-8 h-8 bg-green-100 rounded-lg mr-3">
                      <svg class="w-4 h-4 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Số điện thoại</p>
                      <p class="text-sm text-gray-900">{{ user.phone || 'Chưa có' }}</p>
                    </div>
                  </div>

                  <!-- Role -->
                  <div class="flex items-center py-3 border-b border-gray-100">
                    <div class="flex items-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
                      <svg class="w-4 h-4 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Vai trò</p>
                      <div class="flex items-center mt-1">
                        <span v-if="user.role" :class="getRoleBadgeClasses(user.role.roleId)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                          {{ user.role.name }}
                        </span>
                        <span v-else class="text-sm text-gray-500">Chưa có</span>
                      </div>
                      <p v-if="user.role?.description" class="text-xs text-gray-500 mt-1">
                        {{ user.role.description }}
                      </p>
                    </div>
                  </div>

                  <!-- Department -->
                  <div class="flex items-center py-3 border-b border-gray-100">
                    <div class="flex items-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                      <svg class="w-4 h-4 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Phòng ban</p>
                      <p class="text-sm text-gray-900">{{ user.department || 'Chưa có' }}</p>
                    </div>
                  </div>

                  <!-- Position -->
                  <div class="flex items-center py-3 border-b border-gray-100">
                    <div class="flex items-center w-8 h-8 bg-amber-100 rounded-lg mr-3">
                      <svg class="w-4 h-4 text-amber-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Chức vụ</p>
                      <p class="text-sm text-gray-900">{{ user.position || 'Chưa có' }}</p>
                    </div>
                  </div>

                  <!-- Address -->
                  <div class="flex items-start py-3">
                    <div class="flex items-center w-8 h-8 bg-red-100 rounded-lg mr-3 mt-0.5">
                      <svg class="w-4 h-4 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Địa chỉ</p>
                      <p class="text-sm text-gray-900 leading-relaxed">{{ user.address || 'Chưa có' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex flex-col sm:flex-row-reverse sm:gap-3 gap-2 px-6 py-4 bg-gray-50 border-t">
                <button
                  v-if="canEdit"
                  @click="$emit('edit', user)"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </button>
                <button
                  @click="$emit('update:visible', false)"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Đóng
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
import { computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { useAuthStore } from '@/modules/auth'
import { ROLES } from '@/modules/auth/constants/roles'
import UserAvatar from './UserAvatar.vue'

// Props
const props = defineProps({
  visible: { type: Boolean, default: false },
  user: { type: Object, default: null }
})

// Emits
defineEmits(['update:visible', 'edit'])

// Store
const authStore = useAuthStore()

// Computed
const canEdit = computed(() =>
  authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER])
)

// Methods
const getStatusBadgeClasses = () => {
  return props.user?.block 
    ? 'bg-red-100 text-red-800'
    : 'bg-green-100 text-green-800'
}

const getRoleBadgeClasses = (roleId) => {
  const roleClasses = {
    [ROLES.ADMIN]: 'bg-red-100 text-red-800',
    [ROLES.WAREHOUSE_MANAGER]: 'bg-amber-100 text-amber-800',
    [ROLES.PRODUCTION_MANAGER]: 'bg-orange-100 text-orange-800',
    [ROLES.QC_STAFF]: 'bg-green-100 text-green-800',
    [ROLES.OPERATOR]: 'bg-blue-100 text-blue-800',
    [ROLES.MAINTENANCE_STAFF]: 'bg-indigo-100 text-indigo-800',
    [ROLES.REGULATORY_AFFAIRS]: 'bg-purple-100 text-purple-800',
    [ROLES.SALES_STAFF]: 'bg-emerald-100 text-emerald-800',
    [ROLES.ACCOUNTANT]: 'bg-yellow-100 text-yellow-800',
    [ROLES.VIEWER]: 'bg-gray-100 text-gray-800'
  }
  return roleClasses[roleId] || 'bg-gray-100 text-gray-800'
}
</script>
