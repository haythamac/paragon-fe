<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    totalCount: {
        type: Number,
        default: 0
    }
})

const searchQuery = ref('')
const selectedRarity = ref('all')
const showAll = ref(false)

// Rarity color mapping
const rarityColors = {
    epic: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    legendary: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    rare: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    common: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
}

// Placeholder data
const placeholderItems = [
    { id: 1, name: 'Dragon Sword', rarity: 'epic', category: 'Consumable', quantity: 1 },
    { id: 2, name: 'Phoenix Feather', rarity: 'common', category: 'Accessory', quantity: 1 },
    { id: 3, name: 'Health Potion', rarity: 'legendary', category: 'Consumable', quantity: 1 },
    { id: 4, name: 'Mystic Shield', rarity: 'rare', category: 'Material', quantity: 4 },
    { id: 5, name: 'Ancient Tome', rarity: 'common', category: 'Material', quantity: 4 },
    { id: 6, name: 'Crystal Amulet', rarity: 'common', category: 'Armor', quantity: 3 },
    { id: 7, name: 'Silver Bow', rarity: 'epic', category: 'Weapon', quantity: 2 },
    { id: 8, name: 'Golden Helmet', rarity: 'legendary', category: 'Armor', quantity: 1 },
    { id: 9, name: 'Enchanted Ring', rarity: 'rare', category: 'Accessory', quantity: 5 },
    { id: 10, name: 'Magic Staff', rarity: 'epic', category: 'Weapon', quantity: 1 },
]

const rarities = [
    { value: 'all', label: 'All Rarities' },
    { value: 'legendary', label: 'Legendary' },
    { value: 'epic', label: 'Epic' },
    { value: 'rare', label: 'Rare' },
    { value: 'common', label: 'Common' }
]

const displayItems = computed(() => {
    return props.items.length ? props.items : placeholderItems
})

const filteredItemsAll = computed(() => {
    let filtered = displayItems.value

    if (searchQuery.value) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    if (selectedRarity.value !== 'all') {
        filtered = filtered.filter(item => item.rarity === selectedRarity.value)
    }

    return filtered
})

const filteredItems = computed(() => {
    return showAll.value ? filteredItemsAll.value : filteredItemsAll.value.slice(0, 8)
})

const toggleShowAll = () => {
    showAll.value = !showAll.value
}
</script>

<template>
    <div class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-4">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 class="text-lg font-bold text-white">
                Prize Items ({{ totalCount || displayItems.length }})
            </h2>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-2.5">
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Search items by name or category..."
                class="w-full bg-[#1a1a1f] border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
        </div>

        <!-- Rarity Filter -->
        <div class="relative mb-3">
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
            </div>
            <select v-model="selectedRarity"
                class="w-full bg-[#1a1a1f] border border-gray-700 rounded-lg pl-8 pr-7 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer">
                <option v-for="rarity in rarities" :key="rarity.value" :value="rarity.value">
                    {{ rarity.label }}
                </option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>

        <!-- Prize Items Grid - 2 columns -->
        <div v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
            <div v-for="item in filteredItems" :key="item.id"
                class="bg-[#13131a] border border-gray-700 rounded-lg p-2.5 hover:border-gray-600 transition-colors">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="text-sm font-semibold text-white">{{ item.name }}</h3>
                            <span :class="rarityColors[item.rarity]"
                                class="px-1.5 py-0.5 rounded text-xs font-medium border capitalize">
                                {{ item.rarity }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2.5 text-xs">
                            <div>
                                <span class="text-gray-400">Category:</span>
                                <span class="text-gray-200 ml-1">{{ item.category }}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Qty:</span>
                                <span class="text-indigo-400 ml-1 font-medium">{{ item.quantity }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Show All/Less Button -->
        <div class="flex justify-center" v-if="filteredItemsAll.length > 8">
            <button @click="toggleShowAll"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
                {{ showAll ? 'Show Less' : `Show All ${filteredItemsAll.length} Items` }}
            </button>
        </div>

        <!-- Empty State -->
        <div v-if="filteredItems.length === 0" class="text-center py-6">
            <svg class="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p class="text-gray-400 text-xs">No items found</p>
        </div>
    </div>
</template>