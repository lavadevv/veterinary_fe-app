<!-- UserAvatar.vue - User avatar component with HeadlessUI + TailwindCSS -->
<template>
  <div 
    :class="avatarClasses"
    @click="$emit('click')"
    :title="user.fullName"
  >
    <!-- Avatar image if exists -->
    <img 
      v-if="user.b64" 
      :src="`data:${user.fileType || 'image/jpeg'};base64,${user.b64}`"
      :alt="user.fullName"
      class="w-full h-full object-cover"
      @error="handleImageError"
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

    <!-- Online status indicator (optional) -->
    <div 
      v-if="showStatus && user.isOnline"
      :class="statusClasses"
    >
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getUserInitials, getAvatarColor } from '../services/user.service'

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium', // xs, small, medium, large, xl
    validator: (value) => ['xs', 'small', 'medium', 'large', 'xl'].includes(value)
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['click'])

// State
const imageError = ref(false)

// Computed
const initials = computed(() => 
  getUserInitials(props.user.fullName)
)

const avatarColor = computed(() => 
  getAvatarColor(props.user.fullName || props.user.email || 'User')
)

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6',
    small: 'w-8 h-8',
    medium: 'w-10 h-10', 
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const textSizes = {
    xs: 'text-xs',
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xl: 'text-lg'
  }
  return textSizes[props.size]
})

const statusClasses = computed(() => {
  const statusSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    small: 'w-2 h-2 bottom-0 right-0',
    medium: 'w-2.5 h-2.5 bottom-0 right-0',
    large: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-4 h-4 bottom-1 right-1'
  }
  
  return [
    'absolute rounded-full bg-green-400 border-2 border-white',
    statusSizes[props.size]
  ]
})

const avatarClasses = computed(() => [
  'relative rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 flex-shrink-0',
  sizeClasses.value,
  
  // Background color for initials or ring for images
  (props.user.b64 && !imageError.value) 
    ? 'ring-2 ring-gray-200 hover:ring-gray-300' 
    : avatarColor.value,
  
  // Interactive states
  props.clickable && 'cursor-pointer hover:scale-105 hover:shadow-lg transform',
  
  // Focus states for accessibility
  props.clickable && 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
])

// Methods
const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
/* Ensure proper aspect ratio */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Custom gradient backgrounds for better visual variety */
.bg-gradient-avatar-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-avatar-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bg-gradient-avatar-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-avatar-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.bg-gradient-avatar-5 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.bg-gradient-avatar-6 {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.bg-gradient-avatar-7 {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.bg-gradient-avatar-8 {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
}
</style>