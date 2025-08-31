<template>
  <el-card class="monthly-transactions-chart" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-chart-bar mr-2"></i>
          Giao dịch theo tháng
        </h3>
        <div class="chart-controls">
          <el-select v-model="selectedYear" size="small" style="width: 100px">
            <el-option label="2024" value="2024" />
            <el-option label="2023" value="2023" />
          </el-select>
        </div>
      </div>
    </template>

    <div class="chart-container" v-loading="loading">
      <div class="chart-legend" v-if="chartData.series">
        <div 
          v-for="series in chartData.series" 
          :key="series.name"
          class="legend-item"
        >
          <div 
            class="legend-color" 
            :style="{ backgroundColor: series.color }"
          ></div>
          <span class="legend-name">{{ series.name }}</span>
        </div>
      </div>

      <div class="bar-chart" v-if="chartData.months && chartData.series">
        <div class="chart-area">
          <div class="y-axis">
            <div 
              v-for="tick in yAxisTicks" 
              :key="tick"
              class="y-tick"
            >
              {{ tick }}
            </div>
          </div>
          
          <div class="chart-content">
            <div 
              v-for="(month, index) in chartData.months" 
              :key="month"
              class="month-group"
            >
              <div class="bars-container">
                <div 
                  v-for="series in chartData.series" 
                  :key="series.name"
                  class="bar"
                  :style="{
                    height: `${(series.data[index] / maxValue) * 100}%`,
                    backgroundColor: series.color
                  }"
                  @mouseenter="showTooltip($event, series.name, series.data[index], month)"
                  @mouseleave="hideTooltip"
                >
                </div>
              </div>
              <div class="month-label">{{ month }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="no-data">
        <i class="fas fa-chart-bar text-gray-400 text-3xl mb-2"></i>
        <p class="text-gray-500">Không có dữ liệu</p>
      </div>
    </div>

    <!-- Tooltip -->
    <div ref="tooltip" class="chart-tooltip" v-show="tooltipVisible">
      <div class="tooltip-content">
        <div class="tooltip-title">{{ tooltipData.month }}</div>
        <div class="tooltip-value">
          <span class="tooltip-series">{{ tooltipData.series }}:</span>
          <span class="tooltip-number">{{ tooltipData.value }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Refs
const selectedYear = ref('2024')
const tooltip = ref(null)
const tooltipVisible = ref(false)
const tooltipData = ref({})

// Computed
const maxValue = computed(() => {
  if (!props.chartData.series) return 0
  const allValues = props.chartData.series.flatMap(series => series.data)
  return Math.max(...allValues)
})

const yAxisTicks = computed(() => {
  const max = maxValue.value
  const step = Math.ceil(max / 5)
  return Array.from({ length: 6 }, (_, i) => step * i).reverse()
})

// Methods
const showTooltip = (event, seriesName, value, month) => {
  tooltipData.value = {
    series: seriesName,
    value: value,
    month: month
  }
  tooltipVisible.value = true
  
  const rect = event.target.getBoundingClientRect()
  if (tooltip.value) {
    tooltip.value.style.left = `${rect.left + rect.width / 2}px`
    tooltip.value.style.top = `${rect.top - 10}px`
  }
}

const hideTooltip = () => {
  tooltipVisible.value = false
}
</script>

<style scoped>
.monthly-transactions-chart {
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

.chart-container {
  min-height: 300px;
}

.chart-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-name {
  font-size: 14px;
  color: #374151;
}

.bar-chart {
  height: 250px;
}

.chart-area {
  display: flex;
  height: 100%;
}

.y-axis {
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 8px;
  border-right: 1px solid #e5e7eb;
}

.y-tick {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}

.chart-content {
  flex: 1;
  display: flex;
  align-items: end;
  gap: 4px;
  padding: 0 8px;
  border-bottom: 1px solid #e5e7eb;
}

.month-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bars-container {
  height: 200px;
  display: flex;
  align-items: end;
  gap: 2px;
  width: 100%;
  justify-content: center;
}

.bar {
  min-height: 2px;
  width: 12px;
  border-radius: 2px 2px 0 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.bar:hover {
  opacity: 0.8;
}

.month-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
}

.chart-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  transform: translateX(-50%) translateY(-100%);
}

.tooltip-content {
  text-align: center;
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-value {
  display: flex;
  gap: 4px;
  align-items: center;
}

.tooltip-series {
  color: #d1d5db;
}

.tooltip-number {
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .chart-legend {
    justify-content: center;
  }
  
  .bar {
    width: 8px;
  }
  
  .bars-container {
    gap: 1px;
  }
}
</style>
