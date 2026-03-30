<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    allMembers: {
        type: Array,
        required: true
    },
    modelValue: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const memberSearch = ref('')

// Filter members based on search
const filteredMembers = computed(() => {
    if (!memberSearch.value) {
        return props.allMembers
    }
    const query = memberSearch.value.toLowerCase()
    return props.allMembers.filter(member =>
        member.name.toLowerCase().includes(query)
    )
})

// Check if member is selected
const isMemberSelected = (member) => {
    return props.modelValue.some(m => m.id === member.id)
}

// Toggle member selection
const toggleMember = (member) => {
    if (isMemberSelected(member)) {
        // Remove from selection
        const newSelection = props.modelValue.filter(m => m.id !== member.id)
        emit('update:modelValue', newSelection)
    } else {
        // Add to selection
        emit('update:modelValue', [...props.modelValue, member])
    }
}

// Select all members
const selectAll = () => {
    emit('update:modelValue', [...props.allMembers])
}

// Clear all members
const clearAll = () => {
    emit('update:modelValue', [])
}
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-300">
                Players selected: {{ modelValue.length }}
            </p>
            <div class="flex gap-2">
                <button type="button" @click="selectAll"
                    class="text-xs px-2 py-1 rounded bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors">
                    Select All
                </button>
                <button type="button" @click="clearAll"
                    class="text-xs px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors">
                    Clear All
                </button>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="relative">
            <input v-model="memberSearch" type="text" placeholder="Search players..."
                class="w-full px-4 py-2 pl-10 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Players List -->
        <div class="border border-gray-800 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <div v-if="filteredMembers.length > 0" class="flex flex-col gap-3">
                <div v-for="member in filteredMembers" :key="member.id" @click="toggleMember(member)" :class="[
                    'px-4 py-3 rounded-lg border-2 cursor-pointer transition-all',
                    isMemberSelected(member)
                        ? 'bg-green-900/30 border-green-500 text-green-300'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600'
                ]">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-2 h-2 rounded-full',
                                isMemberSelected(member) ? 'bg-green-500' : 'bg-gray-500'
                            ]"></div>
                            <span class="text-sm font-medium">{{ member.name }}</span>
                        </div>
                        <svg v-if="isMemberSelected(member)" class="w-5 h-5 text-green-500" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-12 text-gray-500">
                <svg class="mx-auto h-10 w-10 text-gray-600 mb-3" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="text-sm">No players found</p>
            </div>
        </div>
    </div>
</template>