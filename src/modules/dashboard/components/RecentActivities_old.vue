<template>
  <el-card class="recent-activities" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-clock mr-2"></i>
          Hoạt động gần đây
        </h3>
        <el-button type="text" size="small" @click="refreshActivities">
          <i class="fas fa-refresh"></i>
        </el-button>
      </div>
    </template>

    <div class="activities-list" v-loading="loading">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="activity-item"
      >
        <div class="activity-icon" :class="activity.color">
          <i :class="`fas fa-${activity.icon}`"></i>
        </div>
        
        <div class="activity-content">
          <p class="activity-message">{{ activity.message }}</p>
          <div class="activity-meta">
            <span class="activity-user">
              <i class="fas fa-user"></i>
              {{ activity.user }}
            </span>
            <span class="activity-time">
              <i class="fas fa-clock"></i>
              {{ formatTimeAgo(activity.timestamp) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!activities.length && !loading" class="no-activities">
        <i class="fas fa-inbox text-gray-400 text-2xl mb-2"></i>
        <p class="text-gray-500">Không có hoạt động nào</p>
      </div>
    </div>

    <div class="activities-footer" v-if="activities.length > 0">
      <el-button type="text" size="small" @click="viewAllActivities">
        Xem tất cả hoạt động
        <i class="fas fa-arrow-right ml-1"></i>
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

// Props
const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['refresh', 'view-all'])

// Methods
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Vừa xong'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  }
}

const refreshActivities = () => {
  emit('refresh')
}

const viewAllActivities = () => {
  emit('view-all')
}
</script>

<style scoped>
.recent-activities {
  border-radius: 12px;
  border: none;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
}

.activities-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
}

.activity-icon.primary {
  background-color: #3b82f6;
}

.activity-icon.success {
  background-color: #10b981;
}

.activity-icon.warning {
  background-color: #f59e0b;
}

.activity-icon.info {
  background-color: #06b6d4;
}

.activity-icon.danger {
  background-color: #ef4444;
}

.activity-content {
  flex: 1;
}

.activity-message {
  color: #1f2937;
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.4;
}

.activity-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
}

.activity-user,
.activity-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.activities-footer {
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  text-align: center;
}

.no-activities {
  text-align: center;
  padding: 40px 20px;
}

/* Scrollbar styling */
.activities-list::-webkit-scrollbar {
  width: 4px;
}

.activities-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.activities-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.activities-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
