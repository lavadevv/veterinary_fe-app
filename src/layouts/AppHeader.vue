<script setup>
import { useAuthStore } from '@/modules/auth'
import { getUserInitials, getAvatarColor } from '@/config/avatar'

const auth = useAuthStore()
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Logo + Toggle -->
      <div class="flex items-center space-x-4">
        <slot name="toggle"></slot>
        <div class="flex items-center">
          <div class="text-xl font-bold text-green-600">🌱 PRO</div>
          <div class="hidden md:block ml-4 text-sm text-gray-500">
            Hệ thống quản lý sản xuất
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <!-- <button class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
          🔔
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button> -->

        <!-- User -->
        <router-link to="/profile" v-if="auth.isAuthenticated && auth.user" class="relative flex items-center space-x-3">
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
        </router-link>

        <!-- Nếu chưa đăng nhập -->
        <div v-else>
          <router-link to="/auth/login" class="text-sm text-gray-600 hover:text-green-600">
            Đăng nhập
          </router-link>
        </div>

        <!-- Logout -->
        <button
          v-if="auth.isAuthenticated"
          @click="auth.logout"
          class="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50"
          title="Đăng xuất"
        >
          ⎋
        </button>
      </div>
    </div>
  </header>
</template>
