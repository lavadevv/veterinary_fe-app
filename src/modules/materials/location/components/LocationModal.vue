<!-- LocationModal.vue - Modal container cho create/edit/view location -->
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                'w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all',
                modalSize
              ]"
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      modalIconClass
                    ]"
                  >
                    <component :is="modalIcon" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle as="h3" class="text-lg font-semibold text-gray-900">
                      {{ modalTitle }}
                    </DialogTitle>
                    <p v-if="modalSubtitle" class="text-sm text-gray-600 mt-1">
                      {{ modalSubtitle }}
                    </p>
                  </div>
                </div>

                <button
                  @click="handleClose"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <!-- Modal Content -->
              <div class="max-h-[calc(100vh-200px)] overflow-y-auto">
                <!-- Create/Edit Form -->
                <div v-if="mode === 'create' || mode === 'edit'" class="p-6">
                  <LocationForm
                    :initial-data="location"
                    :warehouses="warehouses"
                    :loading="loading"
                    :is-edit="mode === 'edit'"
                    @submit="handleSubmit"
                    @cancel="handleClose"
                  />
                </div>

                <!-- View Details -->
                <div v-else-if="mode === 'view'" class="p-6">
                  <LocationDetails
                    :location="location"
                    :can-edit="canEdit"
                    :can-delete="canDelete"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @close="handleClose"
                  />
                </div>

                <!-- Delete Confirmation -->
                <div v-else-if="mode === 'delete'" class="p-6">
                  <LocationDeleteConfirm
                    :location="location"
                    :loading="loading"
                    @confirm="handleDeleteConfirm"
                    @cancel="handleClose"
                  />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import LocationForm from './LocationForm.vue'
import LocationDetails from './LocationDetails.vue'
import LocationDeleteConfirm from './LocationDeleteConfirm.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit', 'view', 'delete'].includes(value)
  },
  location: {
    type: Object,
    default: () => ({})
  },
  warehouses: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Boolean,
    default: true
  },
  canDelete: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['close', 'submit', 'edit', 'delete', 'delete-confirm'])

// Computed properties
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Tạo vị trí kho mới'
    case 'edit':
      return 'Chỉnh sửa vị trí kho'
    case 'view':
      return 'Chi tiết vị trí kho'
    case 'delete':
      return 'Xác nhận xóa'
    default:
      return 'Vị trí kho'
  }
})

const modalSubtitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Điền thông tin để tạo vị trí kho mới'
    case 'edit':
      return `Chỉnh sửa thông tin vị trí ${props.location?.locationCode}`
    case 'view':
      return `Mã vị trí: ${props.location?.locationCode}`
    case 'delete':
      return 'Hành động này không thể hoàn tác'
    default:
      return null
  }
})

const modalIcon = computed(() => {
  switch (props.mode) {
    case 'create':
      return PlusIcon
    case 'edit':
      return PencilIcon
    case 'view':
      return EyeIcon
    case 'delete':
      return TrashIcon
    default:
      return EyeIcon
  }
})

const modalIconClass = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'bg-gradient-to-br from-green-500 to-emerald-600'
    case 'edit':
      return 'bg-gradient-to-br from-blue-500 to-blue-600'
    case 'view':
      return 'bg-gradient-to-br from-gray-500 to-gray-600'
    case 'delete':
      return 'bg-gradient-to-br from-red-500 to-red-600'
    default:
      return 'bg-gradient-to-br from-gray-500 to-gray-600'
  }
})

const modalSize = computed(() => {
  switch (props.mode) {
    case 'view':
      return 'max-w-4xl'
    case 'delete':
      return 'max-w-md'
    default:
      return 'max-w-2xl'
  }
})

// Methods
const handleClose = () => {
  emit('close')
}

const handleSubmit = (data) => {
  emit('submit', data)
}

const handleEdit = () => {
  emit('edit', props.location)
}

const handleDelete = () => {
  emit('delete', props.location)
}

const handleDeleteConfirm = () => {
  emit('delete-confirm', props.location)
}
</script>
