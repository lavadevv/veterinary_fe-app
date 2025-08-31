<template>
  <el-card class="top-materials" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-trophy mr-2"></i>
          Vật liệu sử dụng nhiều nhất
        </h3>
        <el-dropdown @command="handlePeriod">
          <el-button type="text" size="small">
            Tháng này <i class="fas fa-chevron-down ml-1"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="month">Tháng này</el-dropdown-item>
              <el-dropdown-item command="week">Tuần này</el-dropdown-item>
              <el-dropdown-item command="day">Hôm nay</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <div class="materials-container" v-loading="loading">
      <div class="materials-list" v-if="materials.length > 0">
        <div 
          v-for="(material, index) in materials" 
          :key="material.id"
          class="material-item"
          :class="{ 'top-material': index < 3 }"
        >
          <!-- Ranking -->
          <div class="material-rank" :class="getRankClass(index)">
            <span v-if="index < 3" class="rank-icon">
              <i :class="getRankIcon(index)"></i>
            </span>
            <span v-else class="rank-number">{{ index + 1 }}</span>
          </div>

          <!-- Material Info -->
          <div class="material-info">
            <div class="material-header">
              <h4 class="material-name">{{ material.name }}</h4>
              <div class="material-trend" :class="material.trend">
                <i :class="getTrendIcon(material.trend)"></i>
              </div>
            </div>
            
            <div class="material-category">
              <i class="fas fa-tag"></i>
              {{ material.category }}
            </div>
            
            <div class="material-stats">
              <div class="stat-item">
                <span class="stat-label">Đã sử dụng:</span>
                <span class="stat-value usage">{{ formatNumber(material.usedThisMonth) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Tồn kho:</span>
                <span class="stat-value stock">{{ formatNumber(material.totalStock) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Giá trị:</span>
                <span class="stat-value value">${{ formatNumber(material.value) }}</span>
              </div>
            </div>

            <!-- Usage Progress -->
            <div class="usage-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :style="{ width: `${getUsagePercentage(material)}%` }"
                ></div>
              </div>
              <span class="progress-text">
                {{ getUsagePercentage(material) }}% của tồn kho
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="material-actions">
            <el-button size="small" type="text" @click="viewMaterial(material)">
              <i class="fas fa-eye"></i>
            </el-button>
            <el-button size="small" type="text" @click="manageMaterial(material)">
              <i class="fas fa-cog"></i>
            </el-button>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="no-data">
        <i class="fas fa-box-open text-gray-400 text-3xl mb-2"></i>
        <p class="text-gray-500">Không có dữ liệu vật liệu</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="materials-footer" v-if="materials.length > 0">
      <div class="total-info">
        <span class="total-label">Tổng giá trị:</span>
        <span class="total-value">${{ formatNumber(totalValue) }}</span>
      </div>
      <el-button type="text" size="small" @click="viewAllMaterials">
        Xem tất cả vật liệu
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
  materials: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['view-material', 'manage-material', 'view-all', 'period-change'])

// Computed
const totalValue = computed(() => {
  return props.materials.reduce((sum, material) => sum + material.value, 0)
})

// Methods
const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString('vi-VN')
}

const getRankClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return 'normal'
}

const getRankIcon = (index) => {
  if (index === 0) return 'fas fa-crown'
  if (index === 1) return 'fas fa-medal'
  if (index === 2) return 'fas fa-award'
  return ''
}

const getTrendIcon = (trend) => {
  if (trend === 'up') return 'fas fa-arrow-up'
  if (trend === 'down') return 'fas fa-arrow-down'
  return 'fas fa-minus'
}

const getUsagePercentage = (material) => {
  if (!material.totalStock || material.totalStock === 0) return 0
  return Math.round((material.usedThisMonth / material.totalStock) * 100)
}

const handlePeriod = (command) => {
  emit('period-change', command)
}

const viewMaterial = (material) => {
  emit('view-material', material)
}

const manageMaterial = (material) => {
  emit('manage-material', material)
}

const viewAllMaterials = () => {
  emit('view-all')
}
</script>

<style scoped>
.top-materials {
  border-radius: 12px;
  border: none;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
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

.materials-container {
  min-height: 300px;
}

.materials-list {
  max-height: 500px;
  overflow-y: auto;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  background: white;
}

.material-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.top-material {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
}

.material-rank {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.material-rank.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #92400e;
}

.material-rank.silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e5e7eb 100%);
  color: #374151;
}

.material-rank.bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #d97706 100%);
  color: white;
}

.material-rank.normal {
  background: #f3f4f6;
  color: #6b7280;
}

.rank-icon {
  font-size: 20px;
}

.rank-number {
  font-size: 18px;
}

.material-info {
  flex: 1;
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.material-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.material-trend {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.material-trend.up {
  background: #dcfce7;
  color: #16a34a;
}

.material-trend.down {
  background: #fef2f2;
  color: #dc2626;
}

.material-trend.stable {
  background: #f3f4f6;
  color: #6b7280;
}

.material-category {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.material-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 13px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
}

.stat-value.usage {
  color: #3b82f6;
}

.stat-value.stock {
  color: #059669;
}

.stat-value.value {
  color: #dc2626;
}

.usage-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
}

.material-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.materials-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-label {
  font-size: 14px;
  color: #6b7280;
}

.total-value {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
}

/* Scrollbar styling */
.materials-list::-webkit-scrollbar {
  width: 4px;
}

.materials-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.materials-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.materials-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive */
@media (max-width: 768px) {
  .material-item {
    flex-direction: column;
    text-align: center;
  }
  
  .material-header {
    justify-content: center;
    gap: 8px;
  }
  
  .material-stats {
    justify-content: center;
  }
  
  .material-actions {
    flex-direction: row;
  }
  
  .materials-footer {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
