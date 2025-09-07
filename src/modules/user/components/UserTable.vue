<!-- UserTable.vue - User data table with HeadlessUI + TailwindCSS -->
<template>
  <div class="user-table">
    <!-- Loading Overlay -->
    <div v-if="loading" class="relative">
      <div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span class="ml-3 text-gray-900">Đang tải...</span>
        </div>
      </div>
    </div>

    <!-- Table Container with Responsive Design -->
    <div class="w-full">
      <!-- Desktop Table (Large screens and up) -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <!-- Select All Checkbox -->
              <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  type="checkbox"
                  class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              
              <!-- User Column -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-64">
                <button @click="handleSort('fullName')" class="flex items-center hover:text-gray-900 transition-colors duration-150">
                  Người dùng
                  <span class="ml-1">
                    <ChevronUpIcon v-if="currentSort.field === 'fullName' && currentSort.order === 'asc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronDownIcon v-else-if="currentSort.field === 'fullName' && currentSort.order === 'desc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-400" />
                  </span>
                </button>
              </th>
              
              <!-- Contact Column -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-48">
                Liên hệ
              </th>
              
              <!-- Role Column -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-40">
                <button @click="handleSort('roleId')" class="flex items-center hover:text-gray-900 transition-colors duration-150">
                  Vai trò
                  <span class="ml-1">
                    <ChevronUpIcon v-if="currentSort.field === 'roleId' && currentSort.order === 'asc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronDownIcon v-else-if="currentSort.field === 'roleId' && currentSort.order === 'desc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-400" />
                  </span>
                </button>
              </th>
              
              <!-- Department Column -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-48">
                Bộ phận
              </th>
              
              <!-- Status Column -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                <button @click="handleSort('block')" class="flex items-center hover:text-gray-900 transition-colors duration-150">
                  Trạng thái
                  <span class="ml-1">
                    <ChevronUpIcon v-if="currentSort.field === 'block' && currentSort.order === 'asc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronDownIcon v-else-if="currentSort.field === 'block' && currentSort.order === 'desc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-400" />
                  </span>
                </button>
              </th>
              
              <!-- Actions Column -->
              <th scope="col" class="relative px-6 py-3 w-48">
                <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" :class="{ 'bg-emerald-50': isSelected(user) }" class="hover:bg-gray-50">
              <!-- Checkbox -->
              <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  :checked="isSelected(user)"
                  @change="toggleSelect(user)"
                  type="checkbox"
                  class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>
              
              <!-- User Info -->
              <td class="px-6 py-4 whitespace-nowrap w-64">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <UserAvatar :user="user" size="large" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Contact -->
              <td class="px-6 py-4 whitespace-nowrap w-48">
                <div class="text-sm text-gray-900">
                  <div class="flex items-center mb-1">
                    <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ user.phone || 'Chưa có' }}
                  </div>
                  <div class="flex items-center text-xs text-gray-500">
                    <svg class="w-3 h-3 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="truncate max-w-32">{{ user.address || 'Chưa có' }}</span>
                  </div>
                </div>
              </td>
              
              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap w-40">
                <span :class="getRoleBadgeClasses(user.role?.roleId)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                  {{ user.role?.name || 'Chưa có' }}
                </span>
                <div class="text-xs text-gray-500 mt-1" v-if="user.role?.description">
                  {{ user.role.description }}
                </div>
              </td>
              
              <!-- Department -->
              <td class="px-6 py-4 whitespace-nowrap w-48">
                <div class="text-sm font-medium text-gray-900 truncate max-w-32">
                  {{ user.department || 'Chưa có phòng ban' }}
                </div>
                <div class="text-xs text-gray-500 truncate max-w-32">
                  {{ user.position || 'Chưa có chức vụ' }}
                </div>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap w-32">
                <span :class="user.block ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <svg :class="user.block ? 'text-red-400' : 'text-green-400'" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="user.block" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ user.block ? 'Bị khóa' : 'Hoạt động' }}
                </span>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap w-48">
                <div class="flex items-center space-x-2 justify-end">
                  <!-- View -->
                  <button
                    @click="$emit('view', user)"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-all duration-200 border border-indigo-200 hover:border-indigo-300"
                    title="Xem chi tiết"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span class="hidden sm:inline">Xem</span>
                  </button>
                  
                  <!-- Edit -->
                  <button
                    v-if="canEdit"
                    @click="$emit('edit', user)"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all duration-200 border border-emerald-200 hover:border-emerald-300"
                    title="Chỉnh sửa"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span class="hidden sm:inline">Sửa</span>
                  </button>
                  
                  <!-- Delete -->
                  <button
                    v-if="canDelete && !user.isSuperAdmin"
                    @click="$emit('delete', user)"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                    title="Xóa"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="hidden sm:inline">Xóa</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tablet/Medium Table (md screens only) -->
      <div class="hidden md:block lg:hidden overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <!-- Select All Checkbox -->
              <th scope="col" class="relative w-12 px-4">
                <input
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  type="checkbox"
                  class="absolute left-2 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              
              <!-- User Column -->
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <button @click="handleSort('fullName')" class="flex items-center hover:text-gray-900 transition-colors duration-150">
                  Người dùng
                  <span class="ml-1">
                    <ChevronUpIcon v-if="currentSort.field === 'fullName' && currentSort.order === 'asc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronDownIcon v-else-if="currentSort.field === 'fullName' && currentSort.order === 'desc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-400" />
                  </span>
                </button>
              </th>
              
              <!-- Role Column -->
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <button @click="handleSort('roleId')" class="flex items-center hover:text-gray-900 transition-colors duration-150">
                  Vai trò
                  <span class="ml-1">
                    <ChevronUpIcon v-if="currentSort.field === 'roleId' && currentSort.order === 'asc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronDownIcon v-else-if="currentSort.field === 'roleId' && currentSort.order === 'desc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-400" />
                  </span>
                </button>
              </th>
              
              <!-- Status Column -->
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <button @click="handleSort('block')" class="flex items-center hover:text-gray-900 transition-colors duration-150">
                  Trạng thái
                  <span class="ml-1">
                    <ChevronUpIcon v-if="currentSort.field === 'block' && currentSort.order === 'asc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronDownIcon v-else-if="currentSort.field === 'block' && currentSort.order === 'desc'" class="w-4 h-4 text-emerald-600" />
                    <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-400" />
                  </span>
                </button>
              </th>
              
              <!-- Actions Column -->
              <th scope="col" class="relative px-4 py-3">
                <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" :class="{ 'bg-emerald-50': isSelected(user) }" class="hover:bg-gray-50">
              <!-- Checkbox -->
              <td class="relative w-12 px-4">
                <input
                  :checked="isSelected(user)"
                  @change="toggleSelect(user)"
                  type="checkbox"
                  class="absolute left-2 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>
              
              <!-- User Info -->
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <UserAvatar :user="user" size="small" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ user.fullName }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Role -->
              <td class="px-4 py-3">
                <span :class="getRoleBadgeClasses(user.role?.roleId)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                  {{ user.role?.name || 'Chưa có' }}
                </span>
              </td>
              
              <!-- Status -->
              <td class="px-4 py-3">
                <span :class="user.block ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                  <svg :class="user.block ? 'text-red-400' : 'text-green-400'" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="user.block" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ user.block ? 'Khóa' : 'OK' }}
                </span>
              </td>
              
              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center space-x-1">
                  <button
                    @click="$emit('view', user)"
                    class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  
                  <button
                    @click="$emit('edit', user)"
                    class="inline-flex items-center px-2 py-1 border border-emerald-300 text-xs font-medium rounded text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    @click="$emit('delete', user)"
                    class="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards (Small screens) -->
      <div class="md:hidden space-y-3">
        <div v-for="user in users" :key="user.id" class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center flex-1">
              <input
                :checked="isSelected(user)"
                @change="toggleSelect(user)"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-3 mt-1"
              />
              <div class="flex items-center flex-1 min-w-0">
                <UserAvatar :user="user" size="small" class="mr-3 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ user.fullName }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mobile Info Grid -->
          <div class="grid grid-cols-2 gap-2 text-xs mb-3">
            <div>
              <span class="text-gray-500">Vai trò:</span>
              <div class="mt-1">
                <span :class="getRoleBadgeClasses(user.role?.roleId)" class="inline-flex px-1.5 py-0.5 text-xs font-medium rounded">
                  {{ user.role?.name || 'Chưa có' }}
                </span>
              </div>
            </div>
            <div>
              <span class="text-gray-500">Trạng thái:</span>
              <div class="mt-1">
                <span :class="user.block ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded">
                  <svg :class="user.block ? 'text-red-400' : 'text-green-400'" class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="user.block" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ user.block ? 'Bị khóa' : 'Hoạt động' }}
                </span>
              </div>
            </div>
            <div class="col-span-2" v-if="user.phone">
              <span class="text-gray-500">SĐT:</span>
              <span class="ml-1 text-gray-900">{{ user.phone }}</span>
            </div>
          </div>
          
          <!-- Mobile Actions -->
          <div class="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
            <button
              @click="$emit('view', user)"
              class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem
            </button>
            
            <button
              @click="$emit('edit', user)"
              class="inline-flex items-center px-2.5 py-1.5 border border-emerald-300 text-xs font-medium rounded text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Sửa
            </button>
            
            <button
              @click="$emit('delete', user)"
              class="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data -->
    <div v-if="!loading && users.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có người dùng</h3>
      <p class="mt-1 text-sm text-gray-500">Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại.</p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && users.length > 0" class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 space-y-4 sm:space-y-0 px-6 py-3 bg-white border-t border-gray-200">
      <div class="text-sm text-gray-700">
        Hiển thị {{ ((pagination.current - 1) * pagination.pageSize) + 1 }} - 
        {{ Math.min(pagination.current * pagination.pageSize, pagination.total) }} 
        trong tổng số {{ pagination.total }} người dùng
      </div>
      
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <!-- Previous -->
        <button
          @click="handlePageChange(pagination.current - 1)"
          :disabled="pagination.current <= 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Page Numbers -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="handlePageChange(page)"
          :class="[
            page === pagination.current
              ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]"
        >
          {{ page }}
        </button>
        
        <!-- Next -->
        <button
          @click="handlePageChange(pagination.current + 1)"
          :disabled="pagination.current >= totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/modules/auth'
import { ROLES } from '@/modules/auth/constants/roles'
import UserAvatar from './UserAvatar.vue'

// Props
const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  },
  selected: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits([
  'update:selected', 'view', 'edit', 'delete', 
  'page-change', 'sort-change'
])

// Stores
const authStore = useAuthStore()

// State
const currentSort = ref({ field: 'id', order: 'desc' })

// Computed
const canEdit = computed(() => 
  authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER])
)

const canDelete = computed(() => 
  authStore.hasPermission([ROLES.ADMIN])
)

const isAllSelected = computed(() => 
  props.users.length > 0 && props.users.every(user => isSelected(user))
)

const totalPages = computed(() => 
  Math.ceil(props.pagination.total / props.pagination.pageSize)
)

const visiblePages = computed(() => {
  const current = props.pagination.current
  const total = totalPages.value
  const pages = []
  
  // Simple pagination - show 5 pages around current
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const isSelected = (user) => {
  return props.selected.some(selected => selected.id === user.id)
}

const toggleSelect = (user) => {
  const newSelected = isSelected(user)
    ? props.selected.filter(selected => selected.id !== user.id)
    : [...props.selected, user]
  
  emit('update:selected', newSelected)
}

const toggleSelectAll = () => {
  const newSelected = isAllSelected.value ? [] : [...props.users]
  emit('update:selected', newSelected)
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}

const handleSort = (field) => {
  const newOrder = currentSort.value.field === field && currentSort.value.order === 'asc' ? 'desc' : 'asc'
  currentSort.value = { field, order: newOrder }
  emit('sort-change', { sortField: field, sortType: newOrder })
}

const getRoleBadgeClasses = (roleId) => {
  const roleClasses = {
    [ROLES.ADMIN]: 'bg-red-100 text-red-800',
    [ROLES.WAREHOUSE_MANAGER]: 'bg-amber-100 text-amber-800',
    [ROLES.PRODUCTION_MANAGER]: 'bg-orange-100 text-orange-800',
    [ROLES.QC_STAFF]: 'bg-green-100 text-green-800',
    [ROLES.OPERATOR]: 'bg-blue-100 text-blue-800',
    [ROLES.MAINTENANCE_STAFF]: 'bg-indigo-100 text-indigo-800',
    [ROLES.REGULATORY_AFFAIRS]: 'bg-purple-100 text-purple-800',
    [ROLES.SALES_STAFF]: 'bg-emerald-100 text-emerald-800',
    [ROLES.ACCOUNTANT]: 'bg-yellow-100 text-yellow-800',
    [ROLES.VIEWER]: 'bg-gray-100 text-gray-800'
  }
  return roleClasses[roleId] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.user-table {
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>