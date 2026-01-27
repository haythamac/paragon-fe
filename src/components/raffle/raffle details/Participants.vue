<script setup>
import { ref, computed } from 'vue'
import ItemDistributionModal from './ItemDistributionModal.vue'

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
const showDistributeModal = ref(false)
const selectedParticipant = ref(null)

// Placeholder data
const placeholderParticipants = [
    { id: 1, name: 'Alex Chen', class: 'Warrior', level: 55, growthPower: 7198 },
    { id: 2, name: 'Maria Santos', class: 'Mage', level: 62, growthPower: 11208 },
    { id: 3, name: 'John Smith', class: 'Archer', level: 64, growthPower: 9888 },
    { id: 4, name: 'Yuki Tanaka', class: 'Healer', level: 35, growthPower: 7979 },
    { id: 5, name: 'Carlos Rivera', class: 'Rogue', level: 67, growthPower: 6216 },
    { id: 6, name: 'Emma Wilson', class: 'Paladin', level: 59, growthPower: 5939 },
]

// Available items for distribution
const availableItems = [
    { id: 1, name: 'Dragon Sword', rarity: 'epic', category: 'Weapon', stock: 5 },
    { id: 2, name: 'Phoenix Feather', rarity: 'common', category: 'Material', stock: 20 },
    { id: 3, name: 'Health Potion', rarity: 'legendary', category: 'Consumable', stock: 15 },
    { id: 4, name: 'Mystic Shield', rarity: 'rare', category: 'Armor', stock: 8 },
    { id: 5, name: 'Ancient Tome', rarity: 'common', category: 'Material', stock: 12 },
    { id: 6, name: 'Crystal Amulet', rarity: 'common', category: 'Accessory', stock: 10 },
    { id: 7, name: 'Elixir of Life', rarity: 'legendary', category: 'Consumable', stock: 3 },
    { id: 8, name: 'Steel Sword', rarity: 'common', category: 'Weapon', stock: 25 },
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
    return showAll.value ? filteredParticipantsAll.value : filteredParticipantsAll.value.slice(0, 9)
})

const toggleShowAll = () => {
    showAll.value = !showAll.value
}

const openDistributeModal = (participant) => {
    selectedParticipant.value = participant
    showDistributeModal.value = true
}

const closeDistributeModal = () => {
    showDistributeModal.value = false
    selectedParticipant.value = null
}

const handleDistribute = (data) => {
    console.log('Distributing to:', data.participant)
    console.log('Items:', data.items)
    // Add your distribution logic here
    closeDistributeModal()
}
</script>

<template>
    <div class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-4">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 class="text-lg font-bold text-white">
                Participants ({{ totalCount || displayParticipants.length }})
            </h2>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-3">
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Search by name or class..."
                class="w-full bg-[#1a1a1f] border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
        </div>

        <!-- Participants Grid - 3 columns -->
        <div v-if="filteredParticipants.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-3">
            <div v-for="participant in filteredParticipants" :key="participant.id"
                class="bg-[#13131a] border border-gray-700 rounded-lg p-2.5 hover:border-gray-600 transition-colors">
                <div class="flex items-start justify-between gap-2 mb-1.5">
                    <h3 class="text-sm font-semibold text-white flex-1">{{ participant.name }}</h3>
                    <button @click="openDistributeModal(participant)"
                        class="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded text-xs font-medium transition-colors shrink-0"
                        title="Distribute items">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Distribute</span>
                    </button>
                </div>
                <div class="space-y-0.5">
                    <div class="text-xs">
                        <span class="text-gray-400">Class:</span>
                        <span class="text-indigo-400 ml-1.5 font-medium">{{ participant.class }}</span>
                    </div>
                    <div class="text-xs">
                        <span class="text-gray-400">Level:</span>
                        <span class="text-gray-200 ml-1.5">{{ participant.level }}</span>
                    </div>
                    <div class="text-xs">
                        <span class="text-gray-400">Power:</span>
                        <span class="text-gray-200 ml-1.5">{{ participant.growthPower.toLocaleString() }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Show All/Less Button -->
        <div class="flex justify-center" v-if="filteredParticipantsAll.length > 9">
            <button @click="toggleShowAll"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
                {{ showAll ? 'Show Less' : `Show All ${filteredParticipantsAll.length} Participants` }}
            </button>
        </div>

        <!-- Empty State -->
        <div v-if="filteredParticipants.length === 0" class="text-center py-6">
            <svg class="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-400 text-xs">No participants found</p>
        </div>

        <!-- Distribution Modal -->
        <ItemDistributionModal :is-open="showDistributeModal" :participant="selectedParticipant"
            :available-items="availableItems" @close="closeDistributeModal" @distribute="handleDistribute" />
    </div>
</template>