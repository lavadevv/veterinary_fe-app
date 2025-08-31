<template>
  <el-card class="material-categories-chart" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-chart-pie mr-2"></i>
          Phân loại vật liệu
        </h3>
        <el-dropdown @command="handleExport">
          <el-button type="text" size="small">
            <i class="fas fa-download"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="png">Xuất PNG</el-dropdown-item>
              <el-dropdown-item command="pdf">Xuất PDF</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <div class="chart-container" v-loading="loading">
      <!-- Custom pie chart using CSS -->
      <div class="pie-chart-wrapper" v-if="categories.length > 0">
        <div class="pie-chart">
          <canvas ref="chartCanvas" width="200" height="200"></canvas>
        </div>
        
        <div class="chart-legend">
          <div 
            v-for="(category, index) in categories" 
            :key="index"
            class="legend-item"
          >
            <div 
              class="legend-color" 
              :style="{ backgroundColor: category.color }"
            ></div>
            <div class="legend-content">
              <span class="legend-name">{{ category.name }}</span>
              <span class="legend-value">{{ category.value }}</span>
              <span class="legend-percentage">
                ({{ calculatePercentage(category.value) }}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="no-data">
        <i class="fas fa-chart-pie text-gray-400 text-3xl mb-2"></i>
        <p class="text-gray-500">Không có dữ liệu</p>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

// Props
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Refs
const chartCanvas = ref(null)

// Computed
const totalValue = computed(() => {
  return props.categories.reduce((sum, cat) => sum + cat.value, 0)
})

// Methods
const calculatePercentage = (value) => {
  if (totalValue.value === 0) return 0
  return Math.round((value / totalValue.value) * 100)
}

const drawPieChart = () => {
  if (!chartCanvas.value || !props.categories.length) return
  
  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 80
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  let currentAngle = -Math.PI / 2 // Start from top
  
  props.categories.forEach(category => {
    const sliceAngle = (category.value / totalValue.value) * 2 * Math.PI
    
    // Draw slice
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = category.color
    ctx.fill()
    
    // Draw border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()
    
    currentAngle += sliceAngle
  })
}

const handleExport = (command) => {
  ElMessage.info(`Xuất ${command.toUpperCase()} - Tính năng đang phát triển`)
}

// Lifecycle
onMounted(() => {
  drawPieChart()
})

watch(() => props.categories, () => {
  drawPieChart()
}, { deep: true })
</script>

<style scoped>
.material-categories-chart {
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-chart-wrapper {
  display: flex;
  gap: 24px;
  align-items: center;
  width: 100%;
}

.pie-chart {
  flex-shrink: 0;
}

.chart-legend {
  flex: 1;
  max-height: 250px;
  overflow-y: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.legend-item:last-child {
  border-bottom: none;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.legend-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.legend-value {
  font-size: 16px;
  font-weight: 600;
  color: #059669;
}

.legend-percentage {
  font-size: 12px;
  color: #6b7280;
}

.no-data {
  text-align: center;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .pie-chart-wrapper {
    flex-direction: column;
    text-align: center;
  }
  
  .chart-legend {
    max-height: 200px;
    width: 100%;
  }
}
</style>
