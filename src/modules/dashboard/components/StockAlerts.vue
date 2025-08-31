<template>
  <el-card class="stock-alerts" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Cảnh báo tồn kho
          <el-badge 
            :value="totalAlertsCount" 
            :type="criticalAlertsCount > 0 ? 'danger' : 'warning'"
            class="ml-2"
          />
        </h3>
        <el-dropdown @command="handleFilter">
          <el-button type="text" size="small">
            <i class="fas fa-filter"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all">Tất cả</el-dropdown-item>
              <el-dropdown-item command="critical">Nghiêm trọng</el-dropdown-item>
              <el-dropdown-item command="warning">Cảnh báo</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <div class="alerts-container" v-loading="loading">
      <!-- Alert Summary -->
      <div class="alert-summary" v-if="alerts.length > 0">
        <div class="summary-item critical">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ criticalAlertsCount }} nghiêm trọng</span>
        </div>
        <div class="summary-item warning">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ warningAlertsCount }} cảnh báo</span>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="alerts-list">
        <div 
          v-for="alert in filteredAlerts" 
          :key="alert.id"
          class="alert-item"
          :class="alert.alertLevel"
        >
          <div class="alert-icon">
            <i 
              :class="`fas ${alert.alertLevel === 'critical' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}`"
            ></i>
          </div>
          
          <div class="alert-content">
            <div class="alert-header">
              <h4 class="material-name">{{ alert.materialName }}</h4>
              <span class="alert-level" :class="alert.alertLevel">
                {{ alert.alertLevel === 'critical' ? 'Nghiêm trọng' : 'Cảnh báo' }}
              </span>
            </div>
            
            <div class="alert-details">
              <div class="stock-info">
                <span class="current-stock">
                  Hiện tại: <strong>{{ alert.currentStock }}</strong>
                </span>
                <span class="min-stock">
                  Tối thiểu: <strong>{{ alert.minStock }}</strong>
                </span>
              </div>
              
              <div class="location-info">
                <i class="fas fa-map-marker-alt"></i>
                {{ alert.location }} - {{ alert.warehouse }}
              </div>
              
              <div class="category-info">
                <i class="fas fa-tag"></i>
                {{ alert.category }}
              </div>
              
              <div class="time-info" v-if="alert.daysUntilEmpty">
                <i class="fas fa-clock"></i>
                <span :class="alert.daysUntilEmpty <= 5 ? 'urgent' : ''">
                  Còn {{ alert.daysUntilEmpty }} ngày
                </span>
              </div>
            </div>
          </div>
          
          <div class="alert-actions">
            <el-button size="small" type="primary" @click="handleRestock(alert)">
              <i class="fas fa-plus"></i>
              Nhập thêm
            </el-button>
            <el-button size="small" type="info" @click="handleViewDetails(alert)">
              <i class="fas fa-eye"></i>
            </el-button>
          </div>
        </div>
      </div>

      <div v-if="!filteredAlerts.length && !loading" class="no-alerts">
        <i class="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
        <p class="text-gray-500">Không có cảnh báo nào</p>
      </div>
    </div>

    <!-- View All Footer -->
    <div class="alerts-footer" v-if="alerts.length > 5">
      <el-button type="text" size="small" @click="viewAllAlerts">
        Xem tất cả {{ alerts.length }} cảnh báo
        <i class="fas fa-arrow-right ml-1"></i>
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// Props
const props = defineProps({
  alerts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['restock', 'view-details', 'view-all'])

// Refs
const filterType = ref('all')

// Computed
const criticalAlertsCount = computed(() => 
  props.alerts.filter(alert => alert.alertLevel === 'critical').length
)

const warningAlertsCount = computed(() => 
  props.alerts.filter(alert => alert.alertLevel === 'warning').length
)

const totalAlertsCount = computed(() => props.alerts.length)

const filteredAlerts = computed(() => {
  let filtered = props.alerts
  
  if (filterType.value === 'critical') {
    filtered = filtered.filter(alert => alert.alertLevel === 'critical')
  } else if (filterType.value === 'warning') {
    filtered = filtered.filter(alert => alert.alertLevel === 'warning')
  }
  
  // Limit to 5 items for display
  return filtered.slice(0, 5)
})

// Methods
const handleFilter = (command) => {
  filterType.value = command
}

const handleRestock = (alert) => {
  emit('restock', alert)
}

const handleViewDetails = (alert) => {
  emit('view-details', alert)
}

const viewAllAlerts = () => {
  emit('view-all')
}
</script>

<style scoped>
.stock-alerts {
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

.alerts-container {
  min-height: 300px;
}

.alert-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.summary-item.critical {
  color: #dc2626;
}

.summary-item.warning {
  color: #d97706;
}

.alerts-list {
  max-height: 400px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.alert-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alert-item.critical {
  border-left: 4px solid #dc2626;
  background: #fef2f2;
}

.alert-item.warning {
  border-left: 4px solid #d97706;
  background: #fffbeb;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.critical .alert-icon {
  background: #fee2e2;
  color: #dc2626;
}

.warning .alert-icon {
  background: #fef3c7;
  color: #d97706;
}

.alert-content {
  flex: 1;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.material-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.alert-level {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}

.alert-level.critical {
  background: #dc2626;
  color: white;
}

.alert-level.warning {
  background: #d97706;
  color: white;
}

.alert-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}

.stock-info {
  display: flex;
  gap: 16px;
}

.location-info,
.category-info,
.time-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-info .urgent {
  color: #dc2626;
  font-weight: 600;
}

.alert-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.alerts-footer {
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  text-align: center;
}

.no-alerts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
}

/* Scrollbar styling */
.alerts-list::-webkit-scrollbar {
  width: 4px;
}

.alerts-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.alerts-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.alerts-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive */
@media (max-width: 768px) {
  .alert-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .alert-actions {
    flex-direction: row;
  }
  
  .alert-summary {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
