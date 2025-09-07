<!-- UserFilters.vue - User search filters with HeadlessUI + TailwindCSS -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Filter Header -->
    <div class="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900">Bộ lọc tìm kiếm</h3>
            <p class="text-xs sm:text-sm text-gray-600 hidden sm:block">Tìm kiếm và lọc người dùng theo tiêu chí</p>
          </div>
        </div>
        
        <!-- Mobile/Tablet toggle for advanced filters -->
        <button
          @click="showMobileFilters = !showMobileFilters"
          class="lg:hidden inline-flex items-center px-3 py-2 border border-emerald-200 shadow-sm text-sm font-medium rounded-lg text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
        >
          <svg 
            :class="['w-4 h-4 mr-2 transition-transform duration-200', showMobileFilters ? 'rotate-180' : '']" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          {{ showMobileFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc' }}
        </button>

        <!-- Quick action buttons on desktop -->
        <div class="hidden lg:flex items-center space-x-2">
          <button
            @click="handleReset"
            class="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đặt lại
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Content -->
    <div class="p-4 sm:p-6">
      <form @submit.prevent="handleSearch" class="space-y-5 sm:space-y-6">
        <!-- Always visible search bar -->
        <div class="relative">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm nhanh
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              v-model="localFilters.keywords"
              type="text"
              placeholder="Tìm theo tên, email, số điện thoại..."
              @keyup.enter="handleSearch"
              :class="[
                'block w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg shadow-sm transition-all duration-200',
                'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                'placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200',
                'hover:border-gray-300 focus:bg-white text-sm sm:text-base'
              ]"
            />
            <button
              v-if="localFilters.keywords"
              @click="localFilters.keywords = ''; handleSearch()"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center group"
            >
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Advanced Filters -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-screen"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 max-h-screen"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-show="showMobileFilters || !isMobile" class="overflow-hidden">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <!-- Role Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <Listbox v-model="localFilters.roleId" @update:modelValue="handleSearch">
                  <div class="relative">
                    <ListboxButton 
                      :class="[
                        'relative w-full cursor-pointer rounded-lg border shadow-sm py-2.5 sm:py-3 pl-3 pr-10 text-left transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                        'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white text-sm sm:text-base'
                      ]"
                    >
                      <span class="block truncate text-gray-900">
                        {{ getRoleLabel(localFilters.roleId) || 'Chọn vai trò' }}
                      </span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>

                    <transition 
                      enter-active-class="transition duration-200 ease-out" 
                      enter-from-class="opacity-0 scale-95" 
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition duration-150 ease-in" 
                      leave-from-class="opacity-100 scale-100" 
                      leave-to-class="opacity-0 scale-95"
                    >
                      <ListboxOptions class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                        <ListboxOption v-slot="{ active, selected }" value="" as="template">
                          <li :class="[
                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900', 
                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-150'
                          ]">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              Tất cả vai trò
                            </span>
                            <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                        <ListboxOption
                          v-for="role in roles"
                          :key="role.value"
                          v-slot="{ active, selected }"
                          :value="role.value"
                          as="template"
                        >
                          <li :class="[
                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900', 
                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-150'
                          ]">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              {{ role.label }}
                            </span>
                            <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>

              <!-- Status Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <Listbox v-model="localFilters.block" @update:modelValue="handleSearch">
                  <div class="relative">
                    <ListboxButton 
                      :class="[
                        'relative w-full cursor-pointer rounded-lg border shadow-sm py-2.5 sm:py-3 pl-3 pr-10 text-left transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                        'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white text-sm sm:text-base'
                      ]"
                    >
                      <span class="block truncate text-gray-900">
                        {{ getStatusLabel(localFilters.block) }}
                      </span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>

                    <transition 
                      enter-active-class="transition duration-200 ease-out" 
                      enter-from-class="opacity-0 scale-95" 
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition duration-150 ease-in" 
                      leave-from-class="opacity-100 scale-100" 
                      leave-to-class="opacity-0 scale-95"
                    >
                      <ListboxOptions class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                        <ListboxOption v-slot="{ active, selected }" :value="null" as="template">
                          <li :class="[
                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900', 
                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-150'
                          ]">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              Tất cả trạng thái
                            </span>
                            <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                        <ListboxOption v-slot="{ active, selected }" :value="false" as="template">
                          <li :class="[
                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900', 
                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-150'
                          ]">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              Hoạt động
                            </span>
                            <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                        <ListboxOption v-slot="{ active, selected }" :value="true" as="template">
                          <li :class="[
                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900', 
                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-150'
                          ]">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              Bị khóa
                            </span>
                            <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>

              <!-- Sort Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <Listbox v-model="localFilters.sortField" @update:modelValue="handleSearch">
                  <div class="relative">
                    <ListboxButton 
                      :class="[
                        'relative w-full cursor-pointer rounded-lg border shadow-sm py-2.5 sm:py-3 pl-3 pr-10 text-left transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                        'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white text-sm sm:text-base'
                      ]"
                    >
                      <span class="block truncate text-gray-900">
                        {{ getSortFieldLabel(localFilters.sortField) }}
                      </span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>

                    <transition 
                      enter-active-class="transition duration-200 ease-out" 
                      enter-from-class="opacity-0 scale-95" 
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition duration-150 ease-in" 
                      leave-from-class="opacity-100 scale-100" 
                      leave-to-class="opacity-0 scale-95"
                    >
                      <ListboxOptions class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                        <ListboxOption v-for="option in sortFieldOptions" :key="option.value" v-slot="{ active, selected }" :value="option.value" as="template">
                          <li :class="[
                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900', 
                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-150'
                          ]">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                              {{ option.label }}
                            </span>
                            <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>

              <!-- Sort Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Thứ tự
                </label>
                <button
                  @click="toggleSortType"
                  type="button"
                  :class="[
                    'w-full inline-flex items-center justify-center px-3 py-2.5 sm:py-3 border shadow-sm text-sm sm:text-base font-medium rounded-lg transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
                    'text-gray-700 bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300'
                  ]"
                >
                  <svg v-if="localFilters.sortType === 'asc'" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                  {{ localFilters.sortType === 'asc' ? 'Tăng dần' : 'Giảm dần' }}
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pt-4 border-t border-gray-100">
              <button
                @click="handleSearch"
                type="submit"
                class="flex-1 inline-flex items-center justify-center px-4 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:scale-[1.02] transition-all duration-200"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Áp dụng bộ lọc
              </button>
              <button
                @click="handleReset"
                type="button"
                class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 sm:py-3 border border-gray-200 shadow-sm text-sm sm:text-base font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Đặt lại
              </button>
            </div>
          </div>
        </Transition>
      </form>
    </div>

    <!-- Mobile Filters -->
    <div v-if="isMobile" class="mt-4">
      <Transition name="slide-down">
        <div v-if="showMobileFilters" class="space-y-4">
            <!-- Role Filter Mobile -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <Listbox v-model="localFilters.roleId" @update:modelValue="handleSearch">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <span class="block truncate">{{ getRoleLabel(localFilters.roleId) || 'Chọn vai trò' }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <ListboxOption v-slot="{ active, selected }" value="" as="template">
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">Tất cả vai trò</span>
                          <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                      <ListboxOption v-for="role in roles" :key="role.value" v-slot="{ active, selected }" :value="role.value" as="template">
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ role.label }}</span>
                          <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>

            <!-- Status Filter Mobile -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <Listbox v-model="localFilters.block" @update:modelValue="handleSearch">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <span class="block truncate">{{ getStatusLabel(localFilters.block) }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <ListboxOption v-slot="{ active, selected }" :value="null" as="template">
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">Tất cả trạng thái</span>
                          <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                      <ListboxOption v-slot="{ active, selected }" :value="false" as="template">
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">Hoạt động</span>
                          <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                      <ListboxOption v-slot="{ active, selected }" :value="true" as="template">
                        <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">Bị khóa</span>
                          <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>

            <!-- Sort Options Mobile -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
                <Listbox v-model="localFilters.sortField" @update:modelValue="handleSearch">
                  <div class="relative">
                    <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <span class="block truncate text-sm">{{ getSortFieldLabel(localFilters.sortField) }}</span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                      <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <ListboxOption v-for="option in sortFieldOptions" :key="option.value" v-slot="{ active, selected }" :value="option.value" as="template">
                          <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                            <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                            <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                <button
                  @click="toggleSortType"
                  type="button"
                  class="w-full inline-flex items-center justify-center px-3 py-3 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <svg v-if="localFilters.sortType === 'asc'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                  {{ localFilters.sortType === 'asc' ? 'Tăng' : 'Giảm' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Action Buttons Mobile -->
        <div class="flex gap-3 mt-4">
          <button
            @click="handleSearch"
            type="submit"
            class="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm kiếm
          </button>
          <button
            @click="handleReset"
            type="button"
            class="flex-1 inline-flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { ROLES, ROLE_LABELS } from '@/modules/auth/constants/roles'

// Props
const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:filters', 'search', 'reset'])

// Local state
const localFilters = ref({ ...props.filters })
const showMobileFilters = ref(false)

// Responsive detection
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 1024) // lg breakpoint

// Update window width on resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  // Auto-show filters on desktop
  if (!isMobile.value) {
    showMobileFilters.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// Options
const roles = ref(
  Object.values(ROLES).map(role => ({
    label: ROLE_LABELS[role],
    value: role
  }))
)

const sortFieldOptions = [
  { label: 'ID', value: 'id' },
  { label: 'Tên', value: 'fullName' },
  { label: 'Email', value: 'email' },
  { label: 'Vai trò', value: 'roleId' }
]

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Auto-show/hide filters based on screen size
watch(isMobile, (newIsMobile) => {
  if (!newIsMobile) {
    showMobileFilters.value = true
  } else {
    showMobileFilters.value = false
  }
})

// Helper methods
const getRoleLabel = (roleId) => {
  const role = roles.value.find(r => r.value === roleId)
  return role ? role.label : ''
}

const getStatusLabel = (block) => {
  if (block === null || block === undefined) return 'Tất cả trạng thái'
  return block ? 'Bị khóa' : 'Hoạt động'
}

const getSortFieldLabel = (field) => {
  const option = sortFieldOptions.find(o => o.value === field)
  return option ? option.label : field
}

const toggleSortType = () => {
  localFilters.value.sortType = localFilters.value.sortType === 'asc' ? 'desc' : 'asc'
  handleSearch()
}

// Methods
const handleSearch = () => {
  emit('update:filters', { ...localFilters.value })
  emit('search')
}

const handleReset = () => {
  localFilters.value = {
    keywords: '',
    roleId: '',
    block: null,
    sortField: 'id',
    sortType: 'desc'
  }
  emit('update:filters', { ...localFilters.value })
  emit('reset')
}
</script>

<style scoped>
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.3s ease-in;
}

.slide-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>