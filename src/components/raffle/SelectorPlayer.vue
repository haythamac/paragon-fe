<script setup>
import { computed } from 'vue'

const props = defineProps({
    allMembers: {
        type: Array,
        required: true
    },
    modelValue: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

// Group members alphabetically
const groupedMembers = computed(() => {
    const groups = {}

    props.allMembers.forEach(member => {
        const firstLetter = member.name.charAt(0).toUpperCase()
        if (!groups[firstLetter]) {
            groups[firstLetter] = []
        }
        groups[firstLetter].push(member)
    })

    // Sort groups by letter
    const sortedGroups = Object.keys(groups)
        .sort()
        .map(letter => ({
            letter,
            members: groups[letter].sort((a, b) => a.name.localeCompare(b.name))
        }))

    return sortedGroups
})

// Check if member is selected
const isMemberSelected = (member) => {
    return props.modelValue.some(m => m.id === member.id)
}

// Toggle member selection
const toggleMember = (member) => {
    let newSelection
    if (isMemberSelected(member)) {
        newSelection = props.modelValue.filter(m => m.id !== member.id)
    } else {
        newSelection = [...props.modelValue, member]
    }
    emit('update:modelValue', newSelection)
}

// Select all members
const selectAll = () => {
    emit('update:modelValue', [...props.allMembers])
}

// Clear all selections
const clearAll = () => {
    emit('update:modelValue', [])
}
</script>

<template>
    <div class="space-y-4">
        <!-- Header with controls -->
        <div class="flex items-center justify-between">
            <p class="text-sm text-gray-400">
                Selected: <span class="text-white font-semibold">{{ modelValue.length }}</span> / {{ allMembers.length
                }}
            </p>
            <div class="flex gap-2">
                <button type="button" @click="selectAll"
                    class="text-xs px-3 py-1.5 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors">
                    Select All
                </button>
                <button type="button" @click="clearAll"
                    class="text-xs px-3 py-1.5 rounded-md bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors">
                    Clear All
                </button>
            </div>
        </div>

        <!-- Alphabetically grouped member list -->
        <div class="max-h-[400px] overflow-y-auto space-y-4 pr-2">
            <div v-for="group in groupedMembers" :key="group.letter" class="space-y-1">
                <!-- Letter Header -->
                <h4
                    class="sticky top-0 bg-[#0b0b0d] text-xs font-semibold text-gray-500 uppercase py-2 border-b border-gray-800">
                    {{ group.letter }}
                </h4>

                <!-- Members in this group -->
                <label v-for="member in group.members" :key="member.id"
                    class="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group">
                    <input type="checkbox" :checked="isMemberSelected(member)" @change="toggleMember(member)"
                        class="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer" />

                    <!-- Member name -->
                    <span class="flex-1 text-sm text-gray-200 group-hover:text-white transition-colors">
                        {{ member.name }}
                    </span>

                    <!-- Class and Level -->
                    <div class="flex items-center gap-2 text-xs">
                        <span class="text-gray-400 capitalize">{{ member.class }}</span>
                        <span class="text-gray-500">•</span>
                        <span class="text-gray-500">Lv. {{ member.level }}</span>
                    </div>
                </label>
            </div>

            <!-- Empty state -->
            <p v-if="groupedMembers.length === 0" class="text-center text-gray-500 py-8">
                No members available
            </p>
        </div>
    </div>
</template>