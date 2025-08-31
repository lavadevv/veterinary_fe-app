<!-- src/modules/audit/page/AuditPage.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">HOẠT ĐỘNG</h1>
      <p class="text-gray-600">Theo dõi tất cả hoạt động của hệ thống</p>
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
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Từ khóa</label>
      <el-input
        v-model="searchForm.keywords"
        placeholder="Tìm kiếm..."
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Hành động</label>
      <el-select 
        v-model="searchForm.action" 
        placeholder="Chọn hành động"
        clearable
        @change="handleSearch"
        class="w-full"
      >
        <el-option
          v-for="action in actionOptions"
          :key="action"
          :label="action"
          :value="action"
        />
      </el-select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
      <el-date-picker
        v-model="searchForm.startDate"
        type="datetime"
        placeholder="Chọn ngày bắt đầu"
        format="DD/MM/YYYY HH:mm"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="handleSearch"
        class="w-full"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
      <el-date-picker
        v-model="searchForm.endDate"
        type="datetime"
        placeholder="Chọn ngày kết thúc"
        format="DD/MM/YYYY HH:mm"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="handleSearch"
        class="w-full"
      />
    </div>
  </div>

  <div class="mt-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Sắp xếp theo:</span>
      <el-select 
        v-model="searchForm.sortField" 
        @change="handleSearch"
        class="min-w-[120px]"
        size="default"
      >
        <el-option label="Thời gian" value="timestamp" />
        <el-option label="Hành động" value="action" />
        <el-option label="Người dùng" value="username" />
      </el-select>
      <el-select 
        v-model="searchForm.sortType" 
        @change="handleSearch"
        class="min-w-[120px]"
        size="default"
      >
        <el-option label="Giảm dần" value="desc" />
        <el-option label="Tăng dần" value="asc" />
      </el-select>
    </div>
    
    <el-button 
      type="primary" 
      @click="handleSearch"
      :loading="auditStore.isLoading"
    >
      <el-icon><Search /></el-icon>
      Tìm kiếm
    </el-button>
  </div>
</el-card>

    <!-- Results Summary -->
    <div class="mb-6 flex items-center justify-between">
      <div class="text-gray-600">
        Tổng số: <span class="font-semibold text-gray-900">{{ auditStore.getTotalElements }}</span> bản ghi
      </div>
      <el-button @click="refreshData" :loading="auditStore.isLoading">
        <el-icon><Refresh /></el-icon>
        Làm mới
      </el-button>
    </div>

    <!-- Audit Logs Table -->
    <el-card shadow="hover">
      <el-table
        v-loading="auditStore.isLoading"
        :data="auditStore.getPaginatedLogs"
        stripe
        style="width: 100%"
        :empty-text="auditStore.hasError ? 'Có lỗi xảy ra' : 'Không có dữ liệu'"
        @sort-change="handleSortChange"
        class="audit-table"
      >
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="Người dùng" width="200">
          <template #default="scope">
            <div>
              <div class="font-semibold text-gray-900">{{ scope.row.username }}</div>
              <div class="text-sm text-gray-500" v-if="scope.row.userId !== scope.row.username">
                {{ scope.row.userId }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Hành động" width="120">
          <template #default="scope">
            <el-tag 
              :color="auditStore.getActionColor(scope.row.action)"
              effect="dark"
              class="text-white"
            >
              {{ scope.row.action }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thực thể" width="150">
          <template #default="scope">
            <div>
              <div class="font-semibold">{{ scope.row.entityName }}</div>
              <div class="text-sm text-gray-500 truncate" v-if="scope.row.entityId">
                ID: {{ scope.row.entityId }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="Mô tả" min-width="200" show-overflow-tooltip />

        <el-table-column label="Thời gian" width="160">
          <template #default="scope">
            <div class="text-sm">
              {{ auditStore.formatTimestamp(scope.row.timestamp) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Thông tin kết nối" width="200">
          <template #default="scope">
            <div>
              <div class="text-sm font-mono">{{ scope.row.ipAddress }}</div>
              <div class="text-xs text-gray-500 truncate" :title="scope.row.userAgent">
                {{ scope.row.userAgent }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="120" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="showDetails(scope.row)"
              link
            >
              <el-icon><View /></el-icon>
              Chi tiết
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="auditStore.getTotalElements"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuditStore } from '../store/auditStore';
import { ElMessage, ElDialog, ElButton, ElCard, ElTag, ElPagination, ElTableColumn, ElIcon, ElTable, ElSelect, ElInput, ElDatePicker, ElOption } from 'element-plus';
import { 
  Search, 
  Refresh, 
  View,
  Filter,
  Download
} from '@element-plus/icons-vue';

// Store
const auditStore = useAuditStore();

// Reactive data
const searchForm = reactive({
  keywords: '',
  action: '',
  sortField: 'timestamp',
  sortType: 'desc',
  startDate: '',
  endDate: ''
});

const currentPage = ref(1);
const pageSize = ref(10);
const detailDialogVisible = ref(false);
const selectedLog = ref(null);

// Computed
const actionOptions = computed(() => {
  return ['CREATE', 'UPDATE', 'DELETE', 'READ', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'];
});

// Methods
const loadAuditLogs = async (resetPage = false) => {
  try {
    if (resetPage) {
      currentPage.value = 1;
    }
    
    await auditStore.fetchAuditLogs({
      page: currentPage.value,
      limit: pageSize.value,
      ...searchForm
    });
  } catch (error) {
    ElMessage.error('Không thể tải dữ liệu audit logs');
    console.error('Error loading audit logs:', error);
  }
};

const handleSearch = () => {
  loadAuditLogs(true);
};

const refreshData = () => {
  loadAuditLogs();
};

const resetFilters = () => {
  Object.assign(searchForm, {
    keywords: '',
    action: '',
    sortField: 'timestamp',
    sortType: 'desc',
    startDate: '',
    endDate: ''
  });
  auditStore.resetFilters();
  loadAuditLogs(true);
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  loadAuditLogs(true);
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  loadAuditLogs();
};

const handleSortChange = ({ prop, order }) => {
  if (prop) {
    searchForm.sortField = prop;
    searchForm.sortType = order === 'ascending' ? 'asc' : 'desc';
    loadAuditLogs();
  }
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
  loadAuditLogs();
});
</script>

<style scoped>
.audit-table :deep(.el-table__cell) {
  padding: 8px 0;
}

.audit-table :deep(.el-table__row) {
  cursor: pointer;
}

.audit-table :deep(.el-table__row):hover {
  background-color: #f8fafc;
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
</style>