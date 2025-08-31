<template>
  <div class="user-filters bg-white p-4 rounded-lg shadow-sm border mb-6">
    <el-form :model="localFilters" @submit.prevent="handleSearch">
      <!-- Desktop layout -->
      <el-row :gutter="16" class="hidden lg:flex">
        <!-- Search -->
        <el-col :span="6">
          <el-form-item label="Tìm kiếm">
            <el-input
              v-model="localFilters.keywords"
              placeholder="Tên, email, số điện thoại..."
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <i class="fas fa-search text-gray-400"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <!-- Role Filter -->
        <el-col :span="5">
          <el-form-item label="Vai trò">
            <el-select
              v-model="localFilters.roleId"
              placeholder="Chọn vai trò"
              clearable
              @change="handleSearch"
            >
              <el-option
                v-for="role in roles"
                :key="role.value"
                :label="role.label"
                :value="role.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Status Filter -->
        <el-col :span="4">
          <el-form-item label="Trạng thái">
            <el-select
              v-model="localFilters.block"
              placeholder="Chọn trạng thái"
              clearable
              @change="handleSearch"
            >
              <el-option label="Hoạt động" :value="false" />
              <el-option label="Bị khóa" :value="true" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Sort Field -->
        <el-col :span="4">
          <el-form-item label="Sắp xếp theo">
            <el-select
              v-model="localFilters.sortField"
              @change="handleSearch"
            >
              <el-option label="ID" value="id" />
              <el-option label="Tên" value="fullName" />
              <el-option label="Email" value="email" />
              <el-option label="Vai trò" value="roleId" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Sort Type -->
        <el-col :span="3">
          <el-form-item label="Kiểu sắp xếp">
            <el-select
              v-model="localFilters.sortType"
              @change="handleSearch"
            >
              <el-option label="Tăng dần" value="asc" />
              <el-option label="Giảm dần" value="desc" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Action Buttons -->
        <el-col :span="2">
          <el-form-item label=" ">
            <div class="flex gap-1">
              <el-tooltip content="Tìm kiếm" placement="top">
                <el-button type="primary" @click="handleSearch" size="small" circle>
                  <i class="fas fa-search"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Làm mới" placement="top">
                <el-button @click="handleReset" size="small" circle>
                  <i class="fas fa-redo"></i>
                </el-button>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Tablet layout -->
      <div class="hidden md:block lg:hidden">
        <el-row :gutter="12" class="mb-4">
          <el-col :span="12">
            <el-form-item label="Tìm kiếm">
              <el-input
                v-model="localFilters.keywords"
                placeholder="Tên, email, số điện thoại..."
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <i class="fas fa-search text-gray-400"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Vai trò">
              <el-select
                v-model="localFilters.roleId"
                placeholder="Chọn vai trò"
                clearable
                @change="handleSearch"
              >
                <el-option
                  v-for="role in roles"
                  :key="role.value"
                  :label="role.label"
                  :value="role.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Trạng thái">
              <el-select
                v-model="localFilters.block"
                placeholder="Chọn trạng thái"
                clearable
                @change="handleSearch"
              >
                <el-option label="Hoạt động" :value="false" />
                <el-option label="Bị khóa" :value="true" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="Sắp xếp theo">
              <el-select
                v-model="localFilters.sortField"
                @change="handleSearch"
              >
                <el-option label="ID" value="id" />
                <el-option label="Tên" value="fullName" />
                <el-option label="Email" value="email" />
                <el-option label="Vai trò" value="roleId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Kiểu sắp xếp">
              <el-select
                v-model="localFilters.sortType"
                @change="handleSearch"
              >
                <el-option label="Tăng dần" value="asc" />
                <el-option label="Giảm dần" value="desc" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label=" ">
              <div class="flex gap-2 w-full">
                <el-button type="primary" @click="handleSearch" class="flex-1">
                  <i class="fas fa-search mr-2"></i>
                  Tìm kiếm
                </el-button>
                <el-button @click="handleReset" class="flex-1">
                  <i class="fas fa-redo mr-2"></i>
                  Làm mới
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Mobile layout -->
      <div class="md:hidden">
        <div class="space-y-4">
          <el-form-item label="Tìm kiếm">
            <el-input
              v-model="localFilters.keywords"
              placeholder="Tên, email, số điện thoại..."
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
              size="large"
            >
              <template #prefix>
                <i class="fas fa-search text-gray-400"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="Vai trò">
                <el-select
                  v-model="localFilters.roleId"
                  placeholder="Chọn vai trò"
                  clearable
                  @change="handleSearch"
                  size="large"
                >
                  <el-option
                    v-for="role in roles"
                    :key="role.value"
                    :label="role.label"
                    :value="role.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Trạng thái">
                <el-select
                  v-model="localFilters.block"
                  placeholder="Chọn trạng thái"
                  clearable
                  @change="handleSearch"
                  size="large"
                >
                  <el-option label="Hoạt động" :value="false" />
                  <el-option label="Bị khóa" :value="true" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- Collapsible Advanced Filters -->
          <el-collapse v-model="showAdvancedFilters">
            <el-collapse-item title="Bộ lọc nâng cao" name="advanced">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="Sắp xếp theo">
                    <el-select
                      v-model="localFilters.sortField"
                      @change="handleSearch"
                      size="large"
                    >
                      <el-option label="ID" value="id" />
                      <el-option label="Tên" value="fullName" />
                      <el-option label="Email" value="email" />
                      <el-option label="Vai trò" value="roleId" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Kiểu sắp xếp">
                    <el-select
                      v-model="localFilters.sortType"
                      @change="handleSearch"
                      size="large"
                    >
                      <el-option label="Tăng dần" value="asc" />
                      <el-option label="Giảm dần" value="desc" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>

          <div class="flex gap-2">
            <el-button type="primary" @click="handleSearch" class="flex-1" size="large">
              <i class="fas fa-search mr-2"></i>
              Tìm kiếm
            </el-button>
            <el-button @click="handleReset" class="flex-1" size="large">
              <i class="fas fa-redo mr-2"></i>
              Làm mới
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ROLES, ROLE_LABELS } from '@/modules/auth/constants/roles'

// Props
const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:filters', 'search', 'reset'])

// Local state
const localFilters = ref({ ...props.filters })
const showAdvancedFilters = ref([])

// Role options
const roles = ref(
  Object.values(ROLES).map(role => ({
    label: ROLE_LABELS[role],
    value: role
  }))
)

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Methods
const handleSearch = () => {
  emit('update:filters', { ...localFilters.value })
  emit('search')
}

const handleReset = () => {
  localFilters.value = {
    keywords: '',
    roleId: '',
    block: null,
    sortField: 'id',
    sortType: 'desc'
  }
  emit('update:filters', { ...localFilters.value })
  emit('reset')
}
</script>

<style scoped>
.user-filters {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.el-form-item {
  margin-bottom: 0;
}

.el-form-item__label {
  font-size: 13px;
  font-weight: 500;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .user-filters {
    padding: 1rem;
  }
  
  .el-form-item {
    margin-bottom: 1rem;
  }
  
  .el-form-item__label {
    font-size: 14px;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 640px) {
  .user-filters {
    padding: 0.75rem;
  }
}

/* Ensure full width on mobile */
@media (max-width: 768px) {
  .user-filters :deep(.el-input),
  .user-filters :deep(.el-select) {
    width: 100%;
  }
  
  .user-filters :deep(.el-button) {
    width: 100%;
  }
}
</style>