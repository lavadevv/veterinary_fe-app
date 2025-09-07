/**
 * =====================================================
 * MATERIAL TRANSACTION CONSTANTS
 * =====================================================
 * 
 * Định nghĩa các hằng số liên quan đến giao dịch vật liệu
 */

export const TRANSACTION_TYPES = {
  IMPORT: 'IMPORT',
  EXPORT: 'EXPORT', 
  TRANSFER: 'TRANSFER',
  ADJUSTMENT: 'ADJUSTMENT'
}

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.IMPORT]: 'Nhập kho',
  [TRANSACTION_TYPES.EXPORT]: 'Xuất kho',
  [TRANSACTION_TYPES.TRANSFER]: 'Chuyển kho',
  [TRANSACTION_TYPES.ADJUSTMENT]: 'Điều chỉnh'
}

export const TRANSACTION_TYPE_COLORS = {
  [TRANSACTION_TYPES.IMPORT]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    ring: 'ring-green-600/20',
    dot: 'bg-green-500',
    icon: 'text-green-600'
  },
  [TRANSACTION_TYPES.EXPORT]: {
    bg: 'bg-red-100', 
    text: 'text-red-800',
    ring: 'ring-red-600/20',
    dot: 'bg-red-500',
    icon: 'text-red-600'
  },
  [TRANSACTION_TYPES.TRANSFER]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800', 
    ring: 'ring-blue-600/20',
    dot: 'bg-blue-500',
    icon: 'text-blue-600'
  },
  [TRANSACTION_TYPES.ADJUSTMENT]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    ring: 'ring-yellow-600/20', 
    dot: 'bg-yellow-500',
    icon: 'text-yellow-600'
  }
}

export const TRANSACTION_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUSES.PENDING]: 'Chờ duyệt',
  [TRANSACTION_STATUSES.APPROVED]: 'Đã duyệt',
  [TRANSACTION_STATUSES.REJECTED]: 'Từ chối',
  [TRANSACTION_STATUSES.COMPLETED]: 'Hoàn thành',
  [TRANSACTION_STATUSES.CANCELLED]: 'Đã hủy'
}

export const TRANSACTION_STATUS_COLORS = {
  [TRANSACTION_STATUSES.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    ring: 'ring-yellow-600/20',
    dot: 'bg-yellow-500',
    icon: 'text-yellow-600'
  },
  [TRANSACTION_STATUSES.APPROVED]: {
    bg: 'bg-green-100',
    text: 'text-green-800', 
    ring: 'ring-green-600/20',
    dot: 'bg-green-500',
    icon: 'text-green-600'
  },
  [TRANSACTION_STATUSES.REJECTED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    ring: 'ring-red-600/20',
    dot: 'bg-red-500',
    icon: 'text-red-600'
  },
  [TRANSACTION_STATUSES.COMPLETED]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    ring: 'ring-emerald-600/20',
    dot: 'bg-emerald-500',
    icon: 'text-emerald-600'
  },
  [TRANSACTION_STATUSES.CANCELLED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    ring: 'ring-gray-600/20',
    dot: 'bg-gray-500',
    icon: 'text-gray-600'
  }
}

export const TRANSACTION_TYPE_ICONS = {
  [TRANSACTION_TYPES.IMPORT]: 'ArrowDownOnSquareIcon',
  [TRANSACTION_TYPES.EXPORT]: 'ArrowUpOnSquareIcon',
  [TRANSACTION_TYPES.TRANSFER]: 'ArrowsRightLeftIcon',
  [TRANSACTION_TYPES.ADJUSTMENT]: 'PencilSquareIcon'
}

export const TRANSACTION_STATUS_ICONS = {
  [TRANSACTION_STATUSES.PENDING]: 'ClockIcon',
  [TRANSACTION_STATUSES.APPROVED]: 'CheckIcon',
  [TRANSACTION_STATUSES.REJECTED]: 'XMarkIcon',
  [TRANSACTION_STATUSES.COMPLETED]: 'CheckBadgeIcon',
  [TRANSACTION_STATUSES.CANCELLED]: 'NoSymbolIcon'
}
