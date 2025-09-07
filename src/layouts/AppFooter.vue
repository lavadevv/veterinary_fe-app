<template>
  <footer class="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              The Pro
            </div>
          </div>
          <p class="text-sm text-gray-600 max-w-md">
            Hệ Thống quản lý sản xuất thuốc thú y hiện đại và chuyên nghiệp.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Liên kết nhanh</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/dashboard" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/materials" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Quản lý vật liệu
              </router-link>
            </li>
            <li>
              <router-link to="/production" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Sản xuất
              </router-link>
            </li>
            <li>
              <router-link to="/warehouse" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Kho bãi
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Hỗ trợ</h3>
          <ul class="space-y-2">
            <li>
              <a href="mailto:contact@dophuclam.id.vn" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Email hỗ trợ
              </a>
            </li>
            <li>
              <a href="tel:+84123456789" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Hotline: 0123 456 789
              </a>
            </li>
            <li>
              <router-link to="/help" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Trung tâm trợ giúp
              </router-link>
            </li>
            <li>
              <router-link to="/privacy" class="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                Chính sách bảo mật
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom section -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex items-center space-x-6 text-sm text-gray-600">
            <span>© 2025 The Pro. Tất cả quyền được bảo lưu.</span>
            <span class="hidden md:inline">•</span>
            <span>Phiên bản 1.0.0</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-xs text-gray-500">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Hệ thống hoạt động bình thường</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
