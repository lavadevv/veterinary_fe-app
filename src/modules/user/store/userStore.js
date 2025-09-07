import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as userService from '../services/user.service'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  })
  const filters = ref({
    keywords: '', // Backend expect 'keywords' thay vì 'search'
    roleId: '',
    block: null, // null cho "tất cả", true cho "bị khóa", false cho "hoạt động"
    sortField: 'id',
    sortType: 'desc'
  })
  const selectedUsers = ref([])

  // Getters
  const isLoading = computed(() => loading.value)
  const userCount = computed(() => users.value.length)
  const hasSelectedUsers = computed(() => selectedUsers.value.length > 0)
  const filteredUsers = computed(() => {
    let result = users.value
    
    if (filters.value.keywords) {
      const search = filters.value.keywords.toLowerCase()
      result = result.filter(user => 
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search)
      )
    }
    
    if (filters.value.roleId) {
      result = result.filter(user => user.role?.roleId === filters.value.roleId)
    }
    
    if (filters.value.block !== null) {
      result = result.filter(user => user.block === filters.value.block)
    }
    
    return result
  })

  // Actions
  const fetchUsers = async (customParams = {}) => {
    try {
      loading.value = true
      
      // Lọc bỏ các params rỗng để tránh backend reject
      const cleanParams = {}
      
      // Chỉ thêm params nếu có giá trị
      if (pagination.value.page) cleanParams.page = pagination.value.page
      if (pagination.value.size) cleanParams.size = pagination.value.size
      if (filters.value.keywords?.trim()) cleanParams.keywords = filters.value.keywords.trim()
      if (filters.value.roleId) cleanParams.roleId = filters.value.roleId
      if (filters.value.block !== null && filters.value.block !== undefined) cleanParams.block = filters.value.block
      if (filters.value.sortField) cleanParams.sortField = filters.value.sortField
      if (filters.value.sortType) cleanParams.sortType = filters.value.sortType
      
      // Merge với custom params
      const finalParams = { ...cleanParams, ...customParams }
      
      const response = await userService.getUsers(finalParams)
      
      if (response.data.success) {
        // Backend trả về data.items thay vì data.users
        users.value = response.data.data.items || []
        pagination.value = {
          ...pagination.value,
          total: response.data.data.total || 0,
          totalPages: Math.ceil((response.data.data.total || 0) / pagination.value.size)
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id) => {
    try {
      loading.value = true
      const response = await userService.getUserById(id)
      if (response.data.success) {
        currentUser.value = response.data.data
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    try {
      loading.value = true
      const response = await userService.createUser(userData)
      if (response.data.success) {
        users.value.unshift(response.data.data)
        console.log('Tạo người dùng thành công')
        return response.data.data
      }
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    try {
      loading.value = true
      const response = await userService.updateUser(id, userData)
      if (response.data.success) {
        const index = users.value.findIndex(user => user.id === id)
        if (index !== -1) {
          users.value[index] = response.data.data
        }
        console.log('Cập nhật người dùng thành công')
        return response.data.data
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    try {
      const confirmDelete = confirm('Bạn có chắc chắn muốn xóa người dùng này?')
      if (!confirmDelete) return false

      loading.value = true
      await userService.deleteUser(id)
      
      users.value = users.value.filter(user => user.id !== id)
      console.log('Xóa người dùng thành công')
      return true
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteSelectedUsers = async (ids) => {
    try {
      const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa ${ids.length} người dùng đã chọn?`)
      if (!confirmDelete) return false

      loading.value = true
      await userService.deleteUsers(ids)
      
      users.value = users.value.filter(user => !ids.includes(user.id))
      selectedUsers.value = []
      console.log('Xóa người dùng thành công')
      return true
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const uploadAvatar = async (userId, file) => {
    try {
      loading.value = true
      const response = await userService.uploadUserAvatar(userId, file)
      
      console.log('Upload avatar thành công')
      
      // Update user avatar in store
      const index = users.value.findIndex(user => user.id === userId)
      if (index !== -1) {
        users.value[index].avatar = response.data.data.avatarUrl
      }
      
      return response.data.data
    } catch (error) {
      console.error('Lỗi khi upload avatar:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page when filtering
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  const selectUser = (userId) => {
    if (!selectedUsers.value.includes(userId)) {
      selectedUsers.value.push(userId)
    }
  }

  const unselectUser = (userId) => {
    selectedUsers.value = selectedUsers.value.filter(id => id !== userId)
  }

  const selectAllUsers = () => {
    selectedUsers.value = users.value.map(user => user.id)
  }

  const clearSelection = () => {
    selectedUsers.value = []
  }

  const refreshUsers = async () => {
    await fetchUsers()
  }

  const searchUsers = async (searchTerm) => {
    setFilters({ search: searchTerm })
    await fetchUsers()
  }

  const sortUsers = async (sortBy, sortOrder = 'asc') => {
    setFilters({ sortBy, sortOrder })
    await fetchUsers()
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      role: '',
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
    pagination.value.page = 1
  }

  const clearCurrentUser = () => {
    currentUser.value = null
  }

  const updateUserStatus = async (userId, status) => {
    try {
      loading.value = true
      const response = await userService.updateUserStatus(userId, status)
      
      if (response.data.success) {
        const index = users.value.findIndex(user => user.id === userId)
        if (index !== -1) {
          users.value[index].status = status
        }
        console.log('Cập nhật trạng thái người dùng thành công')
        return true
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    users,
    currentUser,
    loading,
    pagination,
    filters,
    selectedUsers,
    
    // Getters
    isLoading,
    userCount,
    hasSelectedUsers,
    filteredUsers,
    
    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    deleteSelectedUsers,
    uploadAvatar,
    setFilters,
    setPagination,
    selectUser,
    unselectUser,
    selectAllUsers,
    clearSelection,
    refreshUsers,
    searchUsers,
    sortUsers,
    resetFilters,
    clearCurrentUser,
    updateUserStatus
  }
})
