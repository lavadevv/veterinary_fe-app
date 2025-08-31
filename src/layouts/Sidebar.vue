<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { menuItems } from '@/config/menu.config'

const router = useRouter()
const expandedItems = ref(new Set())
const props = defineProps({ sidebarOpen: Boolean, currentRoute: String })

const toggleSubmenu = (index) => {
  if (expandedItems.value.has(index)) expandedItems.value.delete(index)
  else expandedItems.value.add(index)
}
</script>

<template>
  <aside
    :class="{
      'translate-x-0': sidebarOpen,
      '-translate-x-full': !sidebarOpen
    }"
    class="fixed top-16 left-0 z-20 w-64 h-full bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto"
  >
    <nav class="p-4">
      <div class="space-y-2">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="group"
        >
          <!-- Main menu -->
          <div
            @click="item.children ? toggleSubmenu(index) : router.push(item.route)"
            :class="{
              'bg-blue-50 border-blue-200 text-blue-700': currentRoute.startsWith(item.route) || item.active,
              'text-gray-700 hover:bg-gray-50 hover:text-gray-900': !(currentRoute.startsWith(item.route) || item.active)
            }"
            class="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer border border-transparent transition-all duration-200"
          >
            <div class="flex items-center space-x-3">
              <span class="text-lg">{{ item.icon }}</span>
              <span>{{ item.title }}</span>
            </div>
          </div>

          <!-- Submenu -->
          <div
            v-if="item.children && expandedItems.has(index)"
            class="ml-8 mt-2 space-y-1"
          >
            <div
              v-for="child in item.children"
              :key="child.route"
              @click="router.push(child.route)"
              :class="{
                'bg-blue-50 text-blue-600': currentRoute === child.route,
                'text-gray-600 hover:text-gray-900 hover:bg-gray-50': currentRoute !== child.route
              }"
              class="block px-3 py-2 text-sm rounded-md cursor-pointer transition-colors duration-200"
            >
              {{ child.title }}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>
