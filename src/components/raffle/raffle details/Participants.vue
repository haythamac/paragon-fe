<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    participants: {
        type: Array,
        default: () => []
    },
    totalCount: {
        type: Number,
        default: 0
    }
})

const searchQuery = ref('')
const showAll = ref(false)

// Placeholder data
const placeholderParticipants = [
    { id: 1, name: 'Alex Chen', class: 'Warrior', level: 55, growthPower: 7198 },
    { id: 2, name: 'Maria Santos', class: 'Mage', level: 62, growthPower: 11208 },
    { id: 3, name: 'John Smith', class: 'Archer', level: 64, growthPower: 9888 },
    { id: 4, name: 'Yuki Tanaka', class: 'Healer', level: 35, growthPower: 7979 },
    { id: 5, name: 'Carlos Rivera', class: 'Rogue', level: 67, growthPower: 6216 },
    { id: 6, name: 'Emma Wilson', class: 'Paladin', level: 59, growthPower: 5939 },
    { id: 7, name: 'Liam Johnson', class: 'Berserker', level: 70, growthPower: 15000 },
    { id: 8, name: 'Sophia Lee', class: 'Druid', level: 48, growthPower: 8420 },
    { id: 9, name: 'Noah Brown', class: 'Necromancer', level: 53, growthPower: 9100 },
    { id: 10, name: 'Olivia Davis', class: 'Monk', level: 60, growthPower: 7800 },
    { id: 11, name: 'Ethan Martinez', class: 'Sorcerer', level: 65, growthPower: 10234 },
    { id: 12, name: 'Ava Garcia', class: 'Ranger', level: 58, growthPower: 6745 },
    { id: 13, name: 'Mason Rodriguez', class: 'Knight', level: 61, growthPower: 8901 },
    { id: 14, name: 'Isabella Hernandez', class: 'Assassin', level: 66, growthPower: 7200 },
    { id: 15, name: 'Logan Lopez', class: 'Bard', level: 54, growthPower: 5600 },
    { id: 16, name: 'Mia Gonzalez', class: 'Alchemist', level: 57, growthPower: 6345 },
]

const displayParticipants = computed(() => {
    return props.participants.length ? props.participants : placeholderParticipants
})

const filteredParticipantsAll = computed(() => {
    let filtered = displayParticipants.value

    if (searchQuery.value) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            p.class.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    return filtered
})

const filteredParticipants = computed(() => {
    return showAll.value ? filteredParticipantsAll.value : filteredParticipantsAll.value.slice(0, 6)
})

const toggleShowAll = () => {
    showAll.value = !showAll.value
}
</script>

<template>
    <div class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-8">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
            <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 class="text-2xl font-bold text-white">
                Participants ({{ totalCount || displayParticipants.length }})
            </h2>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Search by name or class..."
                class="w-full bg-[#1a1a1f] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
        </div>

        <!-- Participants Grid -->
        <div v-if="filteredParticipants.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div v-for="participant in filteredParticipants" :key="participant.id"
                class="bg-[#13131a] border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-colors">
                <h3 class="text-lg font-semibold text-white mb-3">{{ participant.name }}</h3>
                <div class="space-y-1">
                    <div class="text-sm">
                        <span class="text-gray-400">Class:</span>
                        <span class="text-indigo-400 ml-2 font-medium">{{ participant.class }}</span>
                    </div>
                    <div class="text-sm">
                        <span class="text-gray-400">Level:</span>
                        <span class="text-gray-200 ml-2">{{ participant.level }}</span>
                    </div>
                    <div class="text-sm">
                        <span class="text-gray-400">Growth Power:</span>
                        <span class="text-gray-200 ml-2">{{ participant.growthPower.toLocaleString() }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Show All/Less Button -->
        <div class="flex justify-center mb-6" v-if="filteredParticipantsAll.length > 6">
            <button @click="toggleShowAll"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
                {{ showAll ? 'Show Less' : `Show All ${filteredParticipantsAll.length} Participants` }}
            </button>
        </div>

        <!-- Empty State -->
        <div v-if="filteredParticipants.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-400">No participants found</p>
        </div>
    </div>
</template>