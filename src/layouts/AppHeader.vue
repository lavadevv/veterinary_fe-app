<script setup>
import { ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon, BellIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/modules/auth'
import { getUserInitials, getAvatarColor } from '@/config/avatar'

const auth = useAuthStore()
const notifications = ref([
  { id: 1, text: 'Nguyên liệu ABC sắp hết hạn', time: '5 phút trước', unread: true },
  { id: 2, text: 'Đơn hàng mới từ nhà cung cấp XYZ', time: '1 giờ trước', unread: true },
  { id: 3, text: 'Báo cáo sản xuất tháng đã được tạo', time: '2 giờ trước', unread: false }
])
const unreadCount = ref(2)
</script>

<template>
  <div class="flex h-16 flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Left side - Logo and title -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center">
        <div class="flex items-center space-x-2">
          <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            The Pro
          </div>
        </div>
        <div class="hidden md:block ml-4 text-sm text-gray-500">
          Hệ Thống quản lý sản xuất thuốc thú y
        </div>
      </div>
    </div>

    <!-- Right side - Notifications and User menu -->
    <div class="flex items-center space-x-4">
      <!-- Notifications -->
      <!-- <Menu as="div" class="relative">
        <MenuButton class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <span class="sr-only">Xem thông báo</span>
          <BellIcon class="h-6 w-6" aria-hidden="true" />
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {{ unreadCount }}
          </span>
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Thông báo</h3>
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <MenuItem v-for="notification in notifications" :key="notification.id" v-slot="{ active }">
                  <div :class="[
                    active ? 'bg-gray-50' : '',
                    'p-3 rounded-lg cursor-pointer transition-colors duration-200'
                  ]">
                    <div class="flex items-start space-x-3">
                      <div :class="[
                        notification.unread ? 'bg-blue-500' : 'bg-gray-300',
                        'w-2 h-2 rounded-full mt-2 flex-shrink-0'
                      ]"></div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900">{{ notification.text }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                      </div>
                    </div>
                  </div>
                </MenuItem>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-200">
                <button class="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          </MenuItems>
        </transition>
      </Menu> -->

      <!-- User Profile Menu -->
      <Menu as="div" class="relative" v-if="auth.isAuthenticated && auth.user">
        <MenuButton class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div class="relative">
            <img 
              v-if="auth.user.avatar" 
              class="w-8 h-8 rounded-full object-cover" 
              :src="auth.user.avatar" 
              :alt="auth.user.name || 'user avatar'"
              @error="auth.user.avatar = ''"
            >
            <div 
              v-else 
              :class="getAvatarColor(auth.user?.name || '')"
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            >
              {{ getUserInitials(auth.user?.name || 'U') }}
            </div>
          </div>
          <div class="hidden md:flex flex-col items-start">
            <div class="text-sm font-medium text-gray-900">{{ auth.user.fullName || auth.user.name }}</div>
            <div class="text-xs text-gray-500" :title="auth.userRoles.join(', ')">
              {{ auth.userRoles[0] || 'No role' }}
            </div>
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-500" aria-hidden="true" />
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <router-link
                  to="/profile"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm transition-colors duration-200'
                  ]"
                >
                  <UserIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Hồ sơ cá nhân
                </router-link>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <router-link
                  to="/settings"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm transition-colors duration-200'
                  ]"
                >
                  <CogIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Cài đặt
                </router-link>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="auth.logout"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex w-full items-center px-4 py-2 text-left text-sm transition-colors duration-200'
                  ]"
                >
                  <ArrowRightOnRectangleIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Đăng xuất
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>

      <!-- Login link if not authenticated -->
      <div v-else>
        <router-link 
          to="/auth/login" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
        >
          Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>
