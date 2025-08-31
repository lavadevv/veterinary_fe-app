import api from '@/services/axios'

// Lấy danh sách users với pagination/filter
export const getUsers = (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return api.get(`/user${queryString ? `?${queryString}` : ''}`)
}

// Lấy thông tin 1 user theo ID
export const getUserById = (id) => api.get(`/user/${id}`)

// Lấy avatar của 1 user
export const getUserAvatar = (id) => api.get(`/user/${id}/avatar`)

// Tạo user mới
export const createUser = (data) => api.post('/user', data)

// Cập nhật thông tin user
export const updateUser = (data) => api.put('/user', data)

// Xóa 1 user
export const deleteUser = (id) => api.delete(`/user/${id}`)

// Xóa nhiều users
export const deleteUsers = (ids) => api.delete('/user/all', { data: ids })

// Upload avatar cho user
export const uploadUserAvatar = (id, file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return api.post(`/user/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Utility functions cho avatar
export const getUserInitials = (name) => {
  if (!name) return 'U'
  
  const words = name.trim().split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

export const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ]
  
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}