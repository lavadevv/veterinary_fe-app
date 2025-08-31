<template>
  <div 
    :class="avatarClasses"
    @click="$emit('click')"
  >
    <!-- Avatar image if exists -->
    <img 
      v-if="user.b64" 
      :src="`data:${user.fileType || 'image/jpeg'};base64,${user.b64}`"
      :alt="user.fullName"
      class="w-full h-full object-cover"
    />
    
    <!-- Initials fallback -->
    <span 
      v-else 
      :class="[
        'text-white font-semibold select-none',
        textSizeClass
      ]"
    >
      {{ initials }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getUserInitials, getAvatarColor } from '../services/user.service'

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

// Emits
defineEmits(['click'])

// Computed
const initials = computed(() => 
  getUserInitials(props.user.fullName)
)

const avatarColor = computed(() => 
  getAvatarColor(props.user.fullName || props.user.email || 'User')
)

const sizeClasses = computed(() => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10', 
    large: 'w-12 h-12'
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }
  return textSizes[props.size]
})

const avatarClasses = computed(() => [
  'rounded-full flex items-center justify-center overflow-hidden transition-all duration-200',
  sizeClasses.value,
  props.user.b64 ? 'ring-2 ring-gray-200' : avatarColor.value,
  'hover:scale-105 hover:shadow-md'
])
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>