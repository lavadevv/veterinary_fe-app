# Material Transaction Module

Module quản lý giao dịch vật liệu trong hệ thống quản lý thú y. Hỗ trợ đầy đủ các chức năng CRUD và workflow phê duyệt cho các loại giao dịch vật liệu.

## Tính năng chính

### 🔄 Các loại giao dịch
- **IMPORT**: Nhập kho - Thêm vật liệu vào kho
- **EXPORT**: Xuất kho - Lấy vật liệu ra khỏi kho
- **TRANSFER**: Chuyển kho - Di chuyển vật liệu giữa các kho
- **ADJUSTMENT**: Điều chỉnh - Chỉnh sửa số lượng tồn kho

### 📊 Quản lý trạng thái
- **PENDING**: Chờ duyệt
- **APPROVED**: Đã duyệt
- **REJECTED**: Từ chối
- **COMPLETED**: Hoàn thành
- **CANCELLED**: Đã hủy

### 🎨 Giao diện responsive
- Thiết kế responsive mạnh cho mobile
- Hỗ trợ cả grid view và table view
- Sử dụng HeadlessUI và TailwindCSS
- Icon từ Heroicons

### 🔍 Tìm kiếm và lọc
- Tìm kiếm theo mã giao dịch, mô tả
- Lọc theo loại giao dịch, trạng thái
- Lọc theo kho, lô hàng
- Lọc theo khoảng thời gian
- Sắp xếp đa tiêu chí

### 👥 Phân quyền
- Người tạo có thể chỉnh sửa/xóa giao dịch đang chờ duyệt
- Manager/Admin có thể phê duyệt/từ chối
- Ngăn chặn tự phê duyệt

## Cấu trúc thư mục

```
material-transactions/
├── components/           # Các component UI
│   ├── FilterPanel.vue      # Panel bộ lọc
│   ├── TransactionCard.vue  # Card hiển thị giao dịch
│   ├── TransactionList.vue  # Danh sách giao dịch
│   ├── TransactionTable.vue # Bảng giao dịch
│   ├── TransactionForm.vue  # Form tạo/sửa
│   ├── TransactionDetailModal.vue # Modal chi tiết
│   ├── TransactionTypeBadge.vue   # Badge loại giao dịch
│   ├── StatusBadge.vue      # Badge trạng thái
│   ├── TransactionStats.vue # Thống kê
│   └── RejectModal.vue      # Modal từ chối
├── constants/           # Hằng số
│   └── transaction-types.js # Định nghĩa loại giao dịch và trạng thái
├── pages/              # Trang chính
│   └── MaterialTransactionPage.vue # Trang quản lý giao dịch
├── services/           # API services
│   └── material-transaction.service.js # Service gọi API
├── store/              # Pinia store
│   └── materialTransactionStore.js # Store quản lý state
├── material-transaction.router.js # Routes
└── index.js           # Export module
```

## Sử dụng

### 1. Import module

```javascript
import { 
  useMaterialTransactionStore,
  materialTransactionRoutes,
  MaterialTransactionPage 
} from '@/modules/materials/material-transactions'
```

### 2. Đăng ký routes

```javascript
// router/index.js
import { materialTransactionRoutes } from '@/modules/materials/material-transactions'

const routes = [
  ...materialTransactionRoutes,
  // other routes
]
```

### 3. Sử dụng store

```javascript
import { useMaterialTransactionStore } from '@/modules/materials/material-transactions'

const transactionStore = useMaterialTransactionStore()

// Tải danh sách giao dịch
await transactionStore.fetchTransactions()

// Tạo giao dịch mới
await transactionStore.createTransaction(transactionData)

// Phê duyệt giao dịch
await transactionStore.approveTransaction(transactionId)
```

### 4. Sử dụng components

```vue
<template>
  <TransactionList
    :transactions="transactions"
    :loading="loading"
    :current-user="currentUser"
    :view-mode="viewMode"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
    @approve="handleApprove"
    @reject="handleReject"
  />
</template>
```

## API Integration

Module sử dụng các endpoint API sau:

- `GET /material-transactions` - Lấy danh sách giao dịch
- `GET /material-transactions/{id}` - Chi tiết giao dịch
- `POST /material-transactions` - Tạo giao dịch mới
- `PUT /material-transactions/{id}` - Cập nhật giao dịch
- `DELETE /material-transactions/{id}` - Xóa giao dịch
- `POST /material-transactions/{id}/approve` - Phê duyệt
- `POST /material-transactions/{id}/reject` - Từ chối

## Responsive Design

- **Mobile**: Single column layout, simplified UI
- **Tablet**: 2-3 columns grid, optimized touch targets
- **Desktop**: Full featured layout với sidebar và actions

## Performance

- Lazy loading cho các modal
- Debounced search
- Pagination với page size tùy chỉnh
- Optimized re-renders với computed properties

## Accessibility

- ARIA labels cho screen readers
- Keyboard navigation support
- High contrast colors
- Focus management

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement cho older browsers
