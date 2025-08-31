import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as userService from '../services/user.service'
import { ElMessage, ElMessageBox } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const filters = ref({
    keywords: '',
    roleId: '',
    block: null,
    sortField: 'id',
    sortType: 'desc'
  })

  // Getters
  const activeUsers = computed(() => 
    users.value.filter(user => !user.block)
  )
  
  const blockedUsers = computed(() => 
    users.value.filter(user => user.block)
  )

  // Actions
  const fetchUsers = async (params = {}) => {
    try {
      loading.value = true
      const queryParams = {
        page: params.page !== undefined ? params.page : (pagination.value.current - 1),
        limit: params.limit || pagination.value.pageSize,
        ...filters.value,
        ...params
      }
      
      // Remove empty/null values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key]
        }
      })
      
      const response = await userService.getUsers(queryParams)
      
      if (response.data.success) {
        users.value = response.data.data.items
        pagination.value.total = response.data.data.total
      }
    } catch (error) {
      ElMessage.error('Lỗi khi tải danh sách người dùng')
      console.error('Error fetching users:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id) => {
    try {
      loading.value = true
      const response = await userService.getUserById(id)
      currentUser.value = response.data
      return response.data
    } catch (error) {
      ElMessage.error('Lỗi khi tải thông tin người dùng')
      console.error('Error fetching user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    try {
      loading.value = true
      const response = await userService.createUser(userData)
      
      if (response.data.success) {
        ElMessage.success('Tạo người dùng thành công')
        await fetchUsers() // Refresh list
        return response.data
      }
    } catch (error) {
      ElMessage.error('Lỗi khi tạo người dùng')
      console.error('Error creating user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userData) => {
    try {
      loading.value = true
      const response = await userService.updateUser(userData)
      
      if (response.data.success) {
        ElMessage.success('Cập nhật người dùng thành công')
        await fetchUsers() // Refresh list
        return response.data
      }
    } catch (error) {
      ElMessage.error('Lỗi khi cập nhật người dùng')
      console.error('Error updating user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    try {
      await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn xóa người dùng này?',
        'Xác nhận xóa',
        {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          type: 'warning',
        }
      )

      loading.value = true
      await userService.deleteUser(id)
      
      ElMessage.success('Xóa người dùng thành công')
      await fetchUsers() // Refresh list
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('Lỗi khi xóa người dùng')
        console.error('Error deleting user:', error)
      }
    } finally {
      loading.value = false
    }
  }

  const deleteMultipleUsers = async (ids) => {
    try {
      await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa ${ids.length} người dùng đã chọn?`,
        'Xác nhận xóa',
        {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          type: 'warning',
        }
      )

      loading.value = true
      await userService.deleteUsers(ids)
      
      ElMessage.success('Xóa người dùng thành công')
      await fetchUsers() // Refresh list
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('Lỗi khi xóa người dùng')
        console.error('Error deleting users:', error)
      }
    } finally {
      loading.value = false
    }
  }

  const uploadAvatar = async (userId, file) => {
    try {
      loading.value = true
      const response = await userService.uploadUserAvatar(userId, file)
      
      ElMessage.success('Upload avatar thành công')
      await fetchUsers() // Refresh list
      return response.data
    } catch (error) {
      ElMessage.error('Lỗi khi upload avatar')
      console.error('Error uploading avatar:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.current = 1 // Reset to first page
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  const resetFilters = () => {
    filters.value = {
      keywords: '',
      roleId: '',
      block: null,
      sortField: 'id',
      sortType: 'desc'
    }
    pagination.value.current = 1
  }

  const clearCurrentUser = () => {
    currentUser.value = null
  }

  return {
    // State
    users,
    currentUser,
    loading,
    pagination,
    filters,
    
    // Getters
    activeUsers,
    blockedUsers,
    
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    deleteMultipleUsers,
    uploadAvatar,
    setFilters,
    setPagination,
    resetFilters,
    clearCurrentUser
  }
})