<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/layouts/AppHeader.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import Footer from '@/layouts/AppFooter.vue'

const router = useRouter()

const sidebarOpen = ref(true)
const currentRoute = ref('')
const isMobile = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) sidebarOpen.value = false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  currentRoute.value = router.currentRoute.value.path
  router.afterEach((to) => {
    currentRoute.value = to.path
    if (isMobile.value) sidebarOpen.value = false
  })
})
</script>

<template>

  <div class="min-h-screen bg-gray-50">
    <Header>
      <template #toggle>
        <button
          @click="toggleSidebar"
          class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ☰
        </button>
      </template>
    </Header>

    <Sidebar :sidebarOpen="sidebarOpen" :currentRoute="currentRoute" />

    <div
      v-if="sidebarOpen && isMobile"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-10"
    ></div>

    <main :class="{ 'md:ml-64': sidebarOpen }" class="pt-16 pb-16 transition-all duration-300 ease-in-out">
      <div class="p-6">
        <router-view />
      </div>
    </main>

    <Footer />
  </div>
</template>
