<!-- src/modules/audit/page/UserAuditPage.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="mb-8 flex items-center">
      <el-button @click="goBack" class="mr-4">
        <el-icon><ArrowLeft /></el-icon>
        Quay lại
      </el-button>
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Audit Logs của Người dùng</h1>
        <p class="text-gray-600" v-if="userId">
          User ID: <span class="font-semibold text-blue-600">{{ userId }}</span>
        </p>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <el-card class="text-center hover:shadow-lg transition-shadow duration-200">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <el-icon class="text-2xl text-blue-600"><DataAnalysis /></el-icon>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ totalLogs }}</div>
          <div class="text-sm text-gray-600">Tổng số hoạt động</div>
        </div>
      </el-card>

      <el-card class="text-center hover:shadow-lg transition-shadow duration-200">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <el-icon class="text-2xl text-green-600"><Operation /></el-icon>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ uniqueActions.length }}</div>
          <div class="text-sm text-gray-600">Loại hành động</div>
        </div>
      </el-card>

      <el-card class="text-center hover:shadow-lg transition-shadow duration-200">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <el-icon class="text-2xl text-purple-600"><Files /></el-icon>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ uniqueEntities.length }}</div>
          <div class="text-sm text-gray-600">Thực thể</div>
        </div>
      </el-card>

      <el-card class="text-center hover:shadow-lg transition-shadow duration-200">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
            <el-icon class="text-2xl text-orange-600"><Calendar /></el-icon>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ getDateRange() }}</div>
          <div class="text-sm text-gray-600">Khoảng thời gian</div>
        </div>
      </el-card>
    </div>

    <!-- Filter Section -->
    <el-card class="mb-6" shadow="hover">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Bộ lọc</span>
          <el-button type="info" plain @click="resetFilters" size="small">
            <el-icon><Refresh /></el-icon>
            Đặt lại
          </el-button>
        </div>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hành động</label>
          <el-select 
            v-model="filterForm.action" 
            placeholder="Chọn hành động"
            clearable
            @change="handleFilter"
            class="w-full"
          >
            <el-option
              v-for="action in uniqueActions"
              :key="action"
              :label="action"
              :value="action"
            />
          </el-select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thực thể</label>
          <el-select 
            v-model="filterForm.entity" 
            placeholder="Chọn thực thể"
            clearable
            @change="handleFilter"
            class="w-full"
          >
            <el-option
              v-for="entity in uniqueEntities"
              :key="entity"
              :label="entity"
              :value="entity"
            />
          </el-select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Từ khóa</label>
          <el-input
            v-model="filterForm.keywords"
            placeholder="Tìm kiếm..."
            clearable
            @input="handleFilter"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>

    <!-- Timeline View -->
    <el-card shadow="hover">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Timeline hoạt động</h3>
          <div class="text-sm text-gray-500">
            Hiển thị {{ filteredLogs.length }} / {{ totalLogs }} bản ghi
          </div>
        </div>
      </template>

      <!-- Loading -->
      <div v-if="auditStore.isLoading" class="flex items-center justify-center py-20">
        <el-icon class="animate-spin text-4xl text-blue-500 mr-3"><Loading /></el-icon>
        <span class="text-gray-600">Đang tải dữ liệu...</span>
      </div>

      <!-- Timeline Content -->
      <div v-else-if="filteredLogs.length > 0" class="timeline-container">
        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div 
            v-for="(log, index) in filteredLogs" 
            :key="log.id"
            class="relative flex items-start mb-8 last:mb-0"
          >
            <!-- Timeline Marker -->
            <div 
              class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white relative z-10 shadow-lg"
              :style="{ backgroundColor: auditStore.getActionColor(log.action) }"
            >
              <el-icon class="text-lg">
                <component :is="getActionIconComponent(log.action)" />
              </el-icon>
            </div>
            
            <!-- Timeline Content -->
            <div class="ml-6 flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <el-tag 
                    :color="auditStore.getActionColor(log.action)"
                    effect="dark"
                    class="text-white"
                    size="small"
                  >
                    {{ log.action }}
                  </el-tag>
                  <span class="text-sm text-gray-500">
                    {{ auditStore.formatTimestamp(log.timestamp) }}
                  </span>
                </div>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="showDetails(log)"
                  link
                >
                  <el-icon><View /></el-icon>
                  Chi tiết
                </el-button>
              </div>
              
              <div class="space-y-2">
                <h4 class="font-semibold text-gray-900">{{ log.entityName }}</h4>
                <p class="text-gray-700">{{ log.description }}</p>
                
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <el-icon class="mr-1"><Location /></el-icon>
                    {{ log.ipAddress }}
                  </span>
                  <span class="flex items-center" v-if="log.sessionId">
                    <el-icon class="mr-1"><Key /></el-icon>
                    Session: {{ log.sessionId.substring(0, 8) }}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="text-center py-20">
        <el-icon class="text-6xl text-gray-300 mb-4"><DocumentRemove /></el-icon>
        <p class="text-gray-500 text-lg">Không có dữ liệu phù hợp với bộ lọc</p>
        <el-button @click="resetFilters" type="primary" class="mt-4">
          Xóa bộ lọc
        </el-button>
      </div>
    </el-card>

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Chi tiết Audit Log"
      width="80%"
      :before-close="handleCloseDetail"
      destroy-on-close
    >
      <div v-if="selectedLog" class="space-y-6">
        <!-- Basic Info -->
        <el-card class="border-l-4 border-l-blue-500">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
          </template>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">ID</label>
                <p class="text-gray-900">{{ selectedLog.id }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Người dùng</label>
                <p class="text-gray-900">{{ selectedLog.username }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Hành động</label>
                <el-tag 
                  :color="auditStore.getActionColor(selectedLog.action)"
                  effect="dark"
                  class="text-white"
                >
                  {{ selectedLog.action }}
                </el-tag>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Thực thể</label>
                <p class="text-gray-900">{{ selectedLog.entityName }}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">Thời gian</label>
                <p class="text-gray-900">{{ auditStore.formatTimestamp(selectedLog.timestamp) }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">IP Address</label>
                <p class="text-gray-900 font-mono">{{ selectedLog.ipAddress }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Session ID</label>
                <p class="text-gray-900 font-mono text-sm">{{ selectedLog.sessionId }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Mô tả</label>
                <p class="text-gray-900">{{ selectedLog.description }}</p>
              </div>
            </div>
          </div>
        </el-card>

        <!-- Old Values -->
        <el-card v-if="selectedLog.oldValues" class="border-l-4 border-l-orange-500">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Giá trị cũ</h3>
          </template>
          <pre class="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-60 border">{{ auditStore.formatJsonString(selectedLog.oldValues) }}</pre>
        </el-card>

        <!-- New Values -->
        <el-card v-if="selectedLog.newValues" class="border-l-4 border-l-green-500">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Giá trị mới</h3>
          </template>
          <pre class="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-60 border">{{ auditStore.formatJsonString(selectedLog.newValues) }}</pre>
        </el-card>

        <!-- User Agent Details -->
        <el-card class="border-l-4 border-l-purple-500">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Thông tin User Agent</h3>
          </template>
          <p class="text-sm text-gray-700 break-all">{{ selectedLog.userAgent }}</p>
        </el-card>
      </div>

      <template #footer>
        <div class="text-right">
          <el-button @click="detailDialogVisible = false">Đóng</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuditStore } from '../store/auditStore';
import { ElMessage } from 'element-plus';
import { 
  ArrowLeft,
  Search, 
  Refresh, 
  View,
  Loading,
  DataAnalysis,
  Operation,
  Files,
  Calendar,
  Location,
  Key,
  DocumentRemove,
  Plus,
  Edit,
  Delete,
  User,
  SwitchButton,
  Download,
  Upload,
  Document
} from '@element-plus/icons-vue';

// Router and Store
const route = useRoute();
const router = useRouter();
const auditStore = useAuditStore();

// Reactive data
const userId = ref(route.params.userId);
const filterForm = reactive({
  action: '',
  entity: '',
  keywords: ''
});

const detailDialogVisible = ref(false);
const selectedLog = ref(null);

// Computed properties
const totalLogs = computed(() => auditStore.userAuditLogs.length);

const uniqueActions = computed(() => {
  const actions = auditStore.userAuditLogs.map(log => log.action);
  return [...new Set(actions)];
});

const uniqueEntities = computed(() => {
  const entities = auditStore.userAuditLogs.map(log => log.entityName);
  return [...new Set(entities)];
});

const filteredLogs = computed(() => {
  let logs = [...auditStore.userAuditLogs];
  
  if (filterForm.action) {
    logs = logs.filter(log => log.action === filterForm.action);
  }
  
  if (filterForm.entity) {
    logs = logs.filter(log => log.entityName === filterForm.entity);
  }
  
  if (filterForm.keywords) {
    const keywords = filterForm.keywords.toLowerCase();
    logs = logs.filter(log => 
      log.description?.toLowerCase().includes(keywords) ||
      log.entityName?.toLowerCase().includes(keywords) ||
      log.username?.toLowerCase().includes(keywords) ||
      log.action?.toLowerCase().includes(keywords)
    );
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

// Methods
const loadUserAuditLogs = async () => {
  try {
    await auditStore.fetchUserAuditLogs(userId.value);
  } catch (error) {
    ElMessage.error('Không thể tải dữ liệu audit logs của người dùng');
    console.error('Error loading user audit logs:', error);
  }
};

const getDateRange = () => {
  if (auditStore.userAuditLogs.length === 0) return '---';
  
  const dates = auditStore.userAuditLogs.map(log => new Date(log.timestamp));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  const today = new Date();
  const diffDays = Math.ceil((today - minDate) / (1000 * 60 * 60 * 24));
  
  return `${diffDays} ngày`;
};

const getActionIconComponent = (action) => {
  const iconMap = {
    'CREATE': Plus,
    'UPDATE': Edit,
    'DELETE': Delete,
    'READ': View,
    'VIEW': View,
    'LOGIN': User,
    'LOGOUT': SwitchButton,
    'EXPORT': Download,
    'IMPORT': Upload
  };
  return iconMap[action] || Document;
};

const handleFilter = () => {
  // Filters are applied automatically through computed property
};

const resetFilters = () => {
  Object.assign(filterForm, {
    action: '',
    entity: '',
    keywords: ''
  });
};

const goBack = () => {
  router.push('/audit');
};

const showDetails = (log) => {
  selectedLog.value = log;
  detailDialogVisible.value = true;
};

const handleCloseDetail = () => {
  detailDialogVisible.value = false;
  selectedLog.value = null;
};

// Lifecycle
onMounted(() => {
  loadUserAuditLogs();
});
</script>

<style scoped>
.timeline-container {
  position: relative;
}

/* Timeline animations */
.timeline-container .relative:nth-child(odd) .bg-white {
  animation: slideInLeft 0.5s ease-out;
}

.timeline-container .relative:nth-child(even) .bg-white {
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Custom scrollbar for JSON display */
pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

pre::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

pre::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Card hover effects */
.el-card {
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-2px);
}
</style>