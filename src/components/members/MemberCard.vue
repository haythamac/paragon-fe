<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    status: { 
        type: String,
        default: 'active'
    }
})

const emit = defineEmits(['edit', 'delete', 'mark-inactive', 'reactivate'])

const showActions = ref(false)
const actionsRef = ref(null)

const handleClickOutside = (event) => {
    // If the click is outside the actionsRef, close dropdown
    if (actionsRef.value && !actionsRef.value.contains(event.target)) {
        showActions.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const handleReactivate = () => {
    if (confirm(`Reactivate ${props.name}?`)) {
        emit('reactivate', props.id)
    }
    showActions.value = false
}

// Capitalize first letter of class
const formattedClass = computed(() => {
    return props.class.charAt(0).toUpperCase() + props.class.slice(1)
})

// Format power with commas
const formattedPower = computed(() => {
    return props.power.toLocaleString()
})

const handleEdit = () => {
    emit('edit', props.id)
    showActions.value = false
}

const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${props.name}?`)) {
        emit('delete', props.id)
    }
    showActions.value = false
}

const handleMarkInactive = () => {
    if (confirm(`Mark ${props.name} as inactive?`)) {
        emit('mark-inactive', props.id)
    }
    showActions.value = false
}
</script>

<template>
    <div
        class="relative bg-gray-900 border border-gray-700 rounded-lg p-2 hover:bg-gray-800 transition-colors duration-200">
        <!-- Actions Dropdown Button - top right corner -->
        <div class="absolute top-2 right-2" ref="actionsRef">
            <button @click.stop="showActions = !showActions" class="p-1 hover:bg-gray-700 rounded transition-colors">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            <!-- Dropdown Menu -->
            <transition name="dropdown">
                <div v-if="showActions"
                    class="absolute right-0 mt-1 w-48 bg-[#1a1a1f] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                    <button @click="handleEdit"
                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>

                    <!-- Mark as Inactive OR Reactivate based on status -->
                    <button v-if="status === 'active'" @click="handleMarkInactive"
                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800 transition-colors border-t border-gray-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Mark as Inactive
                    </button>

                    <button v-else @click="handleReactivate"
                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-400 hover:bg-gray-800 transition-colors border-t border-gray-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reactivate Member
                    </button>

                    <button @click="handleDelete"
                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors border-t border-gray-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            </transition>
        </div>

        <!-- Main content - flex layout -->
        <div class="flex items-center gap-2 p-1">
            <!-- Left side: Class icon/badge -->
            <div class="border border-gray-600 rounded-lg p-4 flex items-center justify-center text-gray-400">
                {{ formattedClass }}
            </div>

            <!-- Right side: Member info -->
            <div class="flex-1">
                <!-- Name -->
                <h4 class="text-white font-semibold">{{ name }}</h4>

                <!-- Stats row -->
                <div class="flex items-center gap-4 text-sm text-gray-400">
                    <!-- Level -->
                    <span>Lv. {{ level }}</span>

                    <!-- Power -->
                    <span class="text-yellow-500">⚔️ {{ formattedPower }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 150ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>