<template>
  <div class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <ClockIcon class="w-5 h-5 mr-2 text-emerald-500" />
        Hoạt động gần đây
      </h3>
      <button class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
        Xem tất cả
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 5" :key="n" class="animate-pulse flex items-start space-x-3">
        <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Activities List -->
    <div v-else-if="activities.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <!-- Activity Icon -->
        <div class="flex-shrink-0">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="getActivityIconBg(activity.type)"
          >
            <component 
              :is="getActivityIcon(activity.type)" 
              class="w-4 h-4"
              :class="getActivityIconColor(activity.type)"
            />
          </div>
        </div>

        <!-- Activity Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">
            <span class="font-medium">{{ activity.user }}</span>
            {{ activity.action }}
            <span class="font-medium">{{ activity.target }}</span>
          </p>
          <div class="flex items-center mt-1 space-x-2">
            <p class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</p>
            <span v-if="activity.status" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="getStatusClass(activity.status)">
              {{ activity.status }}
            </span>
          </div>
        </div>

        <!-- Activity Time -->
        <div class="flex-shrink-0">
          <p class="text-xs text-gray-400">{{ formatTime(activity.timestamp) }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <ClockIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Chưa có hoạt động nào</p>
    </div>
  </div>
</template>

<script setup>
import { 
  ClockIcon,
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentPlusIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  activities: {
    type: Array,
    default: () => [
      {
        id: 1,
        user: 'Nguyễn Văn A',
        action: 'đã thêm vật liệu mới',
        target: 'Vaccine ABC-123',
        type: 'create',
        status: 'Thành công',
        timestamp: new Date(Date.now() - 15 * 60000) // 15 minutes ago
      },
      {
        id: 2,
        user: 'Trần Thị B',
        action: 'đã cập nhật thông tin',
        target: 'Kho A1',
        type: 'update',
        status: 'Thành công',
        timestamp: new Date(Date.now() - 30 * 60000) // 30 minutes ago
      },
      {
        id: 3,
        user: 'Lê Văn C',
        action: 'đã xóa',
        target: 'Lô hàng #L001',
        type: 'delete',
        status: 'Cảnh báo',
        timestamp: new Date(Date.now() - 45 * 60000) // 45 minutes ago
      },
      {
        id: 4,
        user: 'Phạm Thị D',
        action: 'đã đăng nhập vào hệ thống',
        target: '',
        type: 'login',
        status: 'Thành công',
        timestamp: new Date(Date.now() - 60 * 60000) // 1 hour ago
      },
      {
        id: 5,
        user: 'Hoàng Văn E',
        action: 'đã tạo báo cáo',
        target: 'Báo cáo tồn kho tháng 9',
        type: 'create',
        status: 'Thành công',
        timestamp: new Date(Date.now() - 90 * 60000) // 1.5 hours ago
      }
    ]
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Methods
const getActivityIcon = (type) => {
  const icons = {
    create: DocumentPlusIcon,
    update: PencilSquareIcon,
    delete: TrashIcon,
    login: ArrowRightOnRectangleIcon,
    warning: ExclamationTriangleIcon,
    user: UserPlusIcon
  }
  return icons[type] || DocumentPlusIcon
}

const getActivityIconBg = (type) => {
  const backgrounds = {
    create: 'bg-emerald-100',
    update: 'bg-blue-100',
    delete: 'bg-red-100',
    login: 'bg-purple-100',
    warning: 'bg-amber-100',
    user: 'bg-indigo-100'
  }
  return backgrounds[type] || 'bg-gray-100'
}

const getActivityIconColor = (type) => {
  const colors = {
    create: 'text-emerald-600',
    update: 'text-blue-600',
    delete: 'text-red-600',
    login: 'text-purple-600',
    warning: 'text-amber-600',
    user: 'text-indigo-600'
  }
  return colors[type] || 'text-gray-600'
}

const getStatusClass = (status) => {
  const classes = {
    'Thành công': 'bg-emerald-100 text-emerald-800',
    'Cảnh báo': 'bg-amber-100 text-amber-800',
    'Lỗi': 'bg-red-100 text-red-800',
    'Đang xử lý': 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return 'Vừa xong'
}

const formatTime = (timestamp) => {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}
</script>
