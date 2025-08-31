<template>
  <el-card class="performance-metrics" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-chart-line mr-2"></i>
          Chỉ số hiệu suất
        </h3>
        <el-select v-model="selectedPeriod" size="small" style="width: 120px">
          <el-option label="30 ngày" value="30d" />
          <el-option label="7 ngày" value="7d" />
          <el-option label="Hôm nay" value="1d" />
        </el-select>
      </div>
    </template>

    <div class="metrics-container" v-loading="loading">
      <!-- Key Metrics Grid -->
      <div class="metrics-grid" v-if="metrics && Object.keys(metrics).length > 0">
        <!-- Inventory Turnover -->
        <div class="metric-card">
          <div class="metric-icon turnover">
            <i class="fas fa-sync-alt"></i>
          </div>
          <div class="metric-content">
            <h4 class="metric-title">Vòng quay kho</h4>
            <div class="metric-value">{{ metrics.inventoryTurnover }}</div>
            <div class="metric-unit">lần/năm</div>
            <div class="metric-trend">
              <i class="fas fa-arrow-up text-green-500"></i>
              <span class="text-green-500">Tốt</span>
            </div>
          </div>
        </div>

        <!-- Order Fulfillment Rate -->
        <div class="metric-card">
          <div class="metric-icon fulfillment">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="metric-content">
            <h4 class="metric-title">Tỷ lệ hoàn thành</h4>
            <div class="metric-value">{{ metrics.orderFulfillmentRate }}%</div>
            <div class="metric-unit">đơn hàng</div>
            <div class="metric-trend">
              <i class="fas fa-arrow-up text-green-500"></i>
              <span class="text-green-500">Xuất sắc</span>
            </div>
          </div>
        </div>

        <!-- Stock Accuracy -->
        <div class="metric-card">
          <div class="metric-icon accuracy">
            <i class="fas fa-bullseye"></i>
          </div>
          <div class="metric-content">
            <h4 class="metric-title">Độ chính xác</h4>
            <div class="metric-value">{{ metrics.stockAccuracy }}%</div>
            <div class="metric-unit">tồn kho</div>
            <div class="metric-trend">
              <i class="fas fa-arrow-up text-green-500"></i>
              <span class="text-green-500">Rất tốt</span>
            </div>
          </div>
        </div>

        <!-- Warehouse Efficiency -->
        <div class="metric-card">
          <div class="metric-icon efficiency">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          <div class="metric-content">
            <h4 class="metric-title">Hiệu suất kho</h4>
            <div class="metric-value">{{ metrics.warehouseEfficiency }}%</div>
            <div class="metric-unit">tổng thể</div>
            <div class="metric-trend">
              <i class="fas fa-arrow-up text-green-500"></i>
              <span class="text-green-500">Tốt</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Metrics -->
      <div class="additional-metrics" v-if="metrics">
        <div class="metrics-row">
          <!-- Processing Time -->
          <div class="mini-metric">
            <div class="mini-metric-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="mini-metric-content">
              <div class="mini-metric-value">{{ metrics.averageProcessingTime }}h</div>
              <div class="mini-metric-label">Thời gian xử lý TB</div>
            </div>
          </div>

          <!-- Cost per Transaction -->
          <div class="mini-metric">
            <div class="mini-metric-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="mini-metric-content">
              <div class="mini-metric-value">${{ metrics.costsPerTransaction }}</div>
              <div class="mini-metric-label">Chi phí/giao dịch</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Trends -->
      <div class="performance-trends" v-if="metrics && metrics.trends">
        <h4 class="trends-title">Xu hướng hiệu suất</h4>
        <div class="trends-grid">
          <!-- Inventory Turnover Trend -->
          <div class="trend-item">
            <div class="trend-header">
              <span class="trend-name">Vòng quay kho</span>
              <span class="trend-current">{{ metrics.inventoryTurnover }}</span>
            </div>
            <div class="trend-chart">
              <div class="mini-chart">
                <div 
                  v-for="(point, index) in metrics.trends.inventoryTurnover.slice(-7)" 
                  :key="index"
                  class="chart-bar"
                  :style="{ height: `${(point.value / getMaxValue(metrics.trends.inventoryTurnover)) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Order Fulfillment Trend -->
          <div class="trend-item">
            <div class="trend-header">
              <span class="trend-name">Hoàn thành đơn</span>
              <span class="trend-current">{{ metrics.orderFulfillmentRate }}%</span>
            </div>
            <div class="trend-chart">
              <div class="mini-chart">
                <div 
                  v-for="(point, index) in metrics.trends.orderFulfillment.slice(-7)" 
                  :key="index"
                  class="chart-bar"
                  :style="{ height: `${point.value}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="no-data">
        <i class="fas fa-chart-line text-gray-400 text-3xl mb-2"></i>
        <p class="text-gray-500">Không có dữ liệu hiệu suất</p>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Refs
const selectedPeriod = ref('30d')

// Methods
const getMaxValue = (trendData) => {
  if (!trendData || !trendData.length) return 100
  return Math.max(...trendData.map(point => point.value))
}
</script>

<style scoped>
.performance-metrics {
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

.metrics-container {
  min-height: 300px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.metric-icon.turnover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.metric-icon.fulfillment {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.metric-icon.accuracy {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.metric-icon.efficiency {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.metric-content {
  flex: 1;
}

.metric-title {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.metric-unit {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.additional-metrics {
  margin-bottom: 24px;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.mini-metric {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-metric-icon {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.mini-metric-value {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
}

.mini-metric-label {
  font-size: 12px;
  color: #6b7280;
}

.performance-trends {
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.trends-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.trend-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.trend-name {
  font-size: 14px;
  color: #6b7280;
}

.trend-current {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.mini-chart {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 40px;
}

.chart-bar {
  flex: 1;
  background: #3b82f6;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.chart-bar:hover {
  opacity: 1;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .trends-grid {
    grid-template-columns: 1fr;
  }
}
</style>
