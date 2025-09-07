<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full">
      <transition-group
        name="toast"
        tag="div"
        class="space-y-4"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center p-4 rounded-lg shadow-lg border-l-4 max-w-sm w-full',
            toastClasses[toast.type] || toastClasses.info
          ]"
        >
          <div class="flex-shrink-0">
            <component :is="toastIcons[toast.type]" class="h-5 w-5" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium">
              {{ toast.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="removeToast(toast.id)"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useToast, TOAST_TYPES } from '@/config/toast.js'

const { toasts, removeToast } = useToast()

// Toast styling classes
const toastClasses = {
  [TOAST_TYPES.SUCCESS]: 'bg-green-50 border-green-400 text-green-800',
  [TOAST_TYPES.ERROR]: 'bg-red-50 border-red-400 text-red-800',
  [TOAST_TYPES.WARNING]: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  [TOAST_TYPES.INFO]: 'bg-blue-50 border-blue-400 text-blue-800'
}

// Toast icons
const toastIcons = {
  [TOAST_TYPES.SUCCESS]: CheckCircleIcon,
  [TOAST_TYPES.ERROR]: XCircleIcon,
  [TOAST_TYPES.WARNING]: ExclamationTriangleIcon,
  [TOAST_TYPES.INFO]: InformationCircleIcon
}
</script>

<style scoped>
/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
