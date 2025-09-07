<template>
  <div class="overview-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <!-- Total Users -->
    <el-card class="stat-card" shadow="hover">
      <div class="stat-content">
        <div class="stat-icon users-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-number">{{ formatNumber(overview.totalUsers) }}</h3>
          <p class="stat-label">Tổng người dùng</p>
          <div class="stat-change positive" v-if="overview.userGrowth > 0">
            <i class="fas fa-arrow-up"></i>
            +{{ overview.userGrowth }}%
          </div>
        </div>
      </div>
    </el-card>

    <!-- Total Materials -->
    <el-card class="stat-card" shadow="hover">
      <div class="stat-content">
        <div class="stat-icon materials-icon">
          <i class="fas fa-boxes"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-number">{{ formatNumber(overview.totalMaterials) }}</h3>
          <p class="stat-label">Tổng vật liệu</p>
          <div class="stat-change positive" v-if="overview.materialGrowth > 0">
            <i class="fas fa-arrow-up"></i>
            +{{ overview.materialGrowth }}%
          </div>
        </div>
      </div>
    </el-card>

    <!-- Total Transactions -->
    <el-card class="stat-card" shadow="hover">
      <div class="stat-content">
        <div class="stat-icon transactions-icon">
          <i class="fas fa-exchange-alt"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-number">{{ formatNumber(overview.totalTransactions) }}</h3>
          <p class="stat-label">Tổng giao dịch</p>
          <div class="stat-change positive" v-if="overview.transactionGrowth > 0">
            <i class="fas fa-arrow-up"></i>
            +{{ overview.transactionGrowth }}%
          </div>
        </div>
      </div>
    </el-card>

    <!-- Stock Alerts -->
    <el-card class="stat-card alert-card" shadow="hover">
      <div class="stat-content">
        <div class="stat-icon alerts-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-number">{{ overview.lowStockAlerts }}</h3>
          <p class="stat-label">Cảnh báo tồn kho</p>
          <div class="stat-change critical">
            <i class="fas fa-exclamation-circle"></i>
            Cần xử lý
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <!-- Secondary Stats -->
  <div class="secondary-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <el-card class="mini-stat" shadow="hover">
      <div class="mini-stat-content">
        <i class="fas fa-warehouse mini-stat-icon"></i>
        <div>
          <p class="mini-stat-number">{{ overview.totalWarehouses }}</p>
          <p class="mini-stat-label">Tổng kho</p>
        </div>
      </div>
    </el-card>

    <el-card class="mini-stat" shadow="hover">
      <div class="mini-stat-content">
        <i class="fas fa-map-marker-alt mini-stat-icon"></i>
        <div>
          <p class="mini-stat-number">{{ overview.availableLocations }}/{{ overview.totalLocations }}</p>
          <p class="mini-stat-label">Vị trí khả dụng</p>
        </div>
      </div>
    </el-card>

    <el-card class="mini-stat" shadow="hover">
      <div class="mini-stat-content">
        <i class="fas fa-chart-pie mini-stat-icon"></i>
        <div>
          <p class="mini-stat-number">{{ overview.capacityUtilization }}%</p>
          <p class="mini-stat-label">Tỷ lệ sử dụng</p>
        </div>
      </div>
    </el-card>

    <el-card class="mini-stat" shadow="hover">
      <div class="mini-stat-content">
        <i class="fas fa-clock mini-stat-icon"></i>
        <div>
          <p class="mini-stat-number">{{ overview.totalCapacity }}%</p>
          <p class="mini-stat-label">Hiệu suất tổng</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  overview: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Methods
const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString('vi-VN')
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.users-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.materials-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.transactions-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.alerts-icon {
  background: linear-gradient(135deg, #ffd89b 0%, #ff7070 100%);
}

.stat-details {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.stat-label {
  color: #6b7280;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.critical {
  color: #ef4444;
}

.alert-card {
  background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%);
}

.mini-stat {
  border-radius: 8px;
  border: none;
}

.mini-stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-stat-icon {
  font-size: 20px;
  color: #6366f1;
}

.mini-stat-number {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.mini-stat-label {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.secondary-stats .el-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
</style>
