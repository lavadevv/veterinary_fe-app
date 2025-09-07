<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { menuItems } from '@/config/menu.config'

const router = useRouter()
const props = defineProps({ 
  currentRoute: String,
  isMobile: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const navigateTo = (route) => {
  router.push(route)
  if (props.isMobile) {
    emit('close')
  }
}

const isActiveRoute = (route) => {
  return props.currentRoute === route || props.currentRoute?.startsWith(route + '/')
}

const hasActiveChild = (children) => {
  if (!children) return false
  return children.some(child => isActiveRoute(child.route))
}
</script>

<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 ring-1 ring-white/10">
    <!-- Logo -->
    <div class="flex h-16 shrink-0 items-center">
      <div class="flex items-center space-x-2">
        <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          The Pro
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="(item, index) in menuItems" :key="index">
              <!-- Items with children (submenu) -->
              <Disclosure as="div" v-if="item.children" v-slot="{ open }" :defaultOpen="hasActiveChild(item.children)">
                <DisclosureButton 
                  :class="[
                    hasActiveChild(item.children) || isActiveRoute(item.route)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50',
                    'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm leading-6 font-semibold transition-all duration-200'
                  ]"
                >
                  <component 
                    :is="item.icon" 
                    :class="[
                      hasActiveChild(item.children) || isActiveRoute(item.route)
                        ? 'text-emerald-600'
                        : 'text-gray-500 group-hover:text-emerald-600',
                      'h-5 w-5'
                    ]"
                  />
                  <span class="flex-1">{{ item.title }}</span>
                  <ChevronRightIcon
                    :class="[
                      open ? 'rotate-90 text-emerald-500' : 'text-gray-400',
                      'h-5 w-5 shrink-0 transition-transform duration-200'
                    ]"
                    aria-hidden="true"
                  />
                </DisclosureButton>
                <DisclosurePanel as="ul" class="mt-1 px-2">
                  <li v-for="child in item.children" :key="child.route">
                    <button
                      @click="navigateTo(child.route)"
                      :class="[
                        isActiveRoute(child.route)
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50 border-transparent',
                        'group flex w-full items-center gap-x-3 rounded-md border py-2 pl-9 pr-2 text-sm leading-6 transition-all duration-200'
                      ]"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" :class="[
                        isActiveRoute(child.route) ? 'bg-emerald-500' : 'bg-gray-300 group-hover:bg-emerald-400'
                      ]"></span>
                      {{ child.title }}
                    </button>
                  </li>
                </DisclosurePanel>
              </Disclosure>

              <!-- Items without children -->
              <button
                v-else
                @click="navigateTo(item.route)"
                :class="[
                  isActiveRoute(item.route)
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50 border-transparent',
                  'group flex w-full items-center gap-x-3 rounded-md border p-2 text-sm leading-6 font-semibold transition-all duration-200'
                ]"
              >
                <component 
                  :is="item.icon" 
                  :class="[
                    isActiveRoute(item.route)
                      ? 'text-emerald-600'
                      : 'text-gray-500 group-hover:text-emerald-600',
                    'h-5 w-5'
                  ]"
                />
                <span>{{ item.title }}</span>
              </button>
            </li>
          </ul>
        </li>

        <!-- Bottom section -->
        <li class="mt-auto">
          <div class="rounded-lg bg-emerald-50 p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <span class="text-2xl">💡</span>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-emerald-800">Mẹo sử dụng</h3>
                <p class="mt-1 text-xs text-emerald-600">
                  Sử dụng phím tắt Ctrl+K để tìm kiếm nhanh
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>
