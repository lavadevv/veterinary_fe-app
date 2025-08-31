// Mock data service for dashboard
import { ElMessage } from 'element-plus'

// Simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data generators
const generateRandomData = (count, min = 0, max = 100) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

const generateTrendData = (days = 30) => {
  const data = []
  const baseValue = 100
  let currentValue = baseValue
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 20
    currentValue = Math.max(0, currentValue + change)
    data.push({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.round(currentValue)
    })
  }
  return data
}

// Dashboard Overview Data
export const getDashboardOverview = async () => {
  await simulateDelay()
  
  try {
    return {
      data: {
        success: true,
        data: {
          totalUsers: 1247,
          totalMaterials: 3456,
          totalWarehouses: 12,
          totalLocations: 342,
          totalTransactions: 8765,
          lowStockAlerts: 23,
          availableLocations: 298,
          totalCapacity: 95.6,
          
          // Percentage changes from last period
          userGrowth: 12.5,
          materialGrowth: 8.3,
          transactionGrowth: 15.7,
          capacityUtilization: 78.4
        }
      }
    }
  } catch (error) {
    ElMessage.error('Lỗi khi tải dữ liệu tổng quan')
    throw error
  }
}

// Recent Activities
export const getRecentActivities = async () => {
  await simulateDelay()
  
  const activities = [
    {
      id: 1,
      type: 'user_created',
      message: 'Tạo người dùng mới: Nguyễn Văn A',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      user: 'Admin',
      icon: 'user-plus',
      color: 'success'
    },
    {
      id: 2,
      type: 'material_updated',
      message: 'Cập nhật vật liệu: Thuốc kháng sinh ABC',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      user: 'Warehouse Manager',
      icon: 'edit',
      color: 'primary'
    },
    {
      id: 3,
      type: 'location_created',
      message: 'Tạo vị trí mới: Kệ A-01-01 tại Kho chính',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      user: 'Staff',
      icon: 'map-marker',
      color: 'info'
    },
    {
      id: 4,
      type: 'stock_alert',
      message: 'Cảnh báo tồn kho thấp: Vitamin B Complex',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      user: 'System',
      icon: 'exclamation-triangle',
      color: 'warning'
    },
    {
      id: 5,
      type: 'transaction_completed',
      message: 'Hoàn thành giao dịch xuất kho #TX001234',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      user: 'Production Manager',
      icon: 'check-circle',
      color: 'success'
    },
    {
      id: 6,
      type: 'user_login',
      message: 'Đăng nhập hệ thống: Trần Thị B',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      user: 'Trần Thị B',
      icon: 'sign-in',
      color: 'info'
    }
  ]
  
  return {
    data: {
      success: true,
      data: activities
    }
  }
}

// Chart Data - Material Categories
export const getMaterialCategoriesData = async () => {
  await simulateDelay()
  
  return {
    data: {
      success: true,
      data: [
        { name: 'Thuốc kháng sinh', value: 156, color: '#FF6B6B' },
        { name: 'Vitamin & Khoáng chất', value: 89, color: '#4ECDC4' },
        { name: 'Thiết bị y tế', value: 234, color: '#45B7D1' },
        { name: 'Vật tư tiêu hao', value: 178, color: '#96CEB4' },
        { name: 'Thuốc gây mê', value: 67, color: '#FFEAA7' },
        { name: 'Hóa chất xét nghiệm', value: 123, color: '#DDA0DD' },
        { name: 'Khác', value: 45, color: '#98D8C8' }
      ]
    }
  }
}

// Chart Data - Monthly Transactions
export const getMonthlyTransactions = async () => {
  await simulateDelay()
  
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
  const inbound = generateRandomData(12, 50, 200)
  const outbound = generateRandomData(12, 30, 180)
  
  return {
    data: {
      success: true,
      data: {
        months,
        series: [
          {
            name: 'Nhập kho',
            data: inbound,
            color: '#4ECDC4'
          },
          {
            name: 'Xuất kho',
            data: outbound,
            color: '#FF6B6B'
          }
        ]
      }
    }
  }
}

// Chart Data - Warehouse Utilization
export const getWarehouseUtilization = async () => {
  await simulateDelay()
  
  const warehouses = [
    { name: 'Kho chính', used: 85, total: 100, efficiency: 92 },
    { name: 'Kho phụ A', used: 67, total: 80, efficiency: 88 },
    { name: 'Kho phụ B', used: 45, total: 60, efficiency: 85 },
    { name: 'Kho lạnh', used: 23, total: 30, efficiency: 95 },
    { name: 'Kho nguyên liệu', used: 78, total: 90, efficiency: 89 }
  ]
  
  return {
    data: {
      success: true,
      data: warehouses.map(w => ({
        ...w,
        utilization: Math.round((w.used / w.total) * 100)
      }))
    }
  }
}

// Stock Alerts Data
export const getStockAlerts = async () => {
  await simulateDelay()
  
  const alerts = [
    {
      id: 1,
      materialName: 'Amoxicillin 500mg',
      currentStock: 12,
      minStock: 50,
      location: 'Kệ A-01-03',
      warehouse: 'Kho chính',
      category: 'Thuốc kháng sinh',
      alertLevel: 'critical',
      daysUntilEmpty: 3
    },
    {
      id: 2,
      materialName: 'Vitamin B Complex',
      currentStock: 28,
      minStock: 100,
      location: 'Kệ B-02-01',
      warehouse: 'Kho chính',
      category: 'Vitamin',
      alertLevel: 'warning',
      daysUntilEmpty: 7
    },
    {
      id: 3,
      materialName: 'Ống tiêm 5ml',
      currentStock: 156,
      minStock: 500,
      location: 'Kệ C-01-05',
      warehouse: 'Kho phụ A',
      category: 'Vật tư tiêu hao',
      alertLevel: 'warning',
      daysUntilEmpty: 12
    },
    {
      id: 4,
      materialName: 'Găng tay y tế',
      currentStock: 45,
      minStock: 200,
      location: 'Kệ D-03-02',
      warehouse: 'Kho phụ B',
      category: 'Vật tư bảo hộ',
      alertLevel: 'critical',
      daysUntilEmpty: 5
    }
  ]
  
  return {
    data: {
      success: true,
      data: alerts
    }
  }
}

// Performance Metrics
export const getPerformanceMetrics = async () => {
  await simulateDelay()
  
  return {
    data: {
      success: true,
      data: {
        inventoryTurnover: 4.2,
        orderFulfillmentRate: 96.8,
        stockAccuracy: 99.2,
        warehouseEfficiency: 87.5,
        averageProcessingTime: 2.3, // hours
        costsPerTransaction: 15.7, // USD
        
        trends: {
          inventoryTurnover: generateTrendData(30),
          orderFulfillment: generateTrendData(30),
          stockAccuracy: generateTrendData(30),
          efficiency: generateTrendData(30)
        }
      }
    }
  }
}

// Top Materials by Usage
export const getTopMaterials = async () => {
  await simulateDelay()
  
  const materials = [
    {
      id: 1,
      name: 'Amoxicillin 500mg',
      category: 'Thuốc kháng sinh',
      usedThisMonth: 234,
      totalStock: 1200,
      value: 15600,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Ống tiêm 5ml',
      category: 'Vật tư tiêu hao',
      usedThisMonth: 1567,
      totalStock: 5000,
      value: 7835,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Băng gạc y tế',
      category: 'Vật tư tiêu hao',
      usedThisMonth: 456,
      totalStock: 2000,
      value: 4560,
      trend: 'down'
    },
    {
      id: 4,
      name: 'Vitamin B Complex',
      category: 'Vitamin',
      usedThisMonth: 89,
      totalStock: 500,
      value: 12450,
      trend: 'stable'
    },
    {
      id: 5,
      name: 'Thuốc gây mê Propofol',
      category: 'Thuốc gây mê',
      usedThisMonth: 23,
      totalStock: 100,
      value: 23000,
      trend: 'up'
    }
  ]
  
  return {
    data: {
      success: true,
      data: materials
    }
  }
}
