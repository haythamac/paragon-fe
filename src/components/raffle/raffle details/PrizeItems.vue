<script setup>
import { ref, computed } from 'vue'
import { itemDistributionAPI } from '@/services/itemDistributionAPI'
import ParticipantDistributionModal from './ParticipantDistributionModal.vue'

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    raffleStatus: {
        type: String,
        default: 'pending',
        validator: (value) => ['pending', 'ongoing', 'completed'].includes(value)
    },
    raffleId: {
        type: [String, Number],
        required: true
    },
    participants: {  // NEW
        type: Array,
        required: true
    }
})

const showDistributeModal = ref(false)
const distributingItem = ref(null)

const searchQuery = ref('')
const selectedRarity = ref('all')
const showAll = ref(false)

const expandedItems = ref(new Set()) // Track expanded items
const itemWinners = ref({}) // Cache winners: { itemId: [...winners] }
const loadingWinners = ref(new Set()) // Track loading state

const emit = defineEmits(['distributed'])

// Rarity color mapping
const rarityColors = {
    epic: 'bg-red-500/20 text-red-300 border-red-500/50',
    legendary: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    rare: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    uncommon: 'bg-green-500/20 text-green-300 border-green-500/50',
    common: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
}

// Status badge configuration
const statusConfig = {
    pending: {
        show: false,
        label: '',
        class: ''
    },
    ongoing: {
        show: true,
        label: 'Drawing...',
        class: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        icon: `<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>`
    },
    completed: {
        show: true,
        label: 'Complete',
        class: 'bg-green-500/20 text-green-300 border-green-500/50',
        icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`
    }
}

const rarities = [
    { value: 'all', label: 'All Rarities' },
    { value: 'legendary', label: 'Legendary' },
    { value: 'epic', label: 'Epic' },
    { value: 'rare', label: 'Rare' },
    { value: 'common', label: 'Common' }
]

const displayItems = computed(() => props.items)

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

// Get current status configuration
const currentStatus = computed(() => statusConfig[props.raffleStatus])

// Check if item is complete (has 0 remaining quantity)
const isItemComplete = (item) => {
    return item.pivot.remaining_quantity === 0
}

// Get item status - for pending state, check if item has stock
const getItemStatus = (item) => {
    if (props.raffleStatus === 'ongoing' && isItemComplete(item)) {
        return statusConfig.completed
    }
    return currentStatus.value
}


// Toggle expand/collapse
const toggleWinners = async (item) => {
    const itemId = item.id

    if (expandedItems.value.has(itemId)) {
        // Collapse
        expandedItems.value.delete(itemId)
    } else {
        // Expand - fetch winners if not cached
        if (!itemWinners.value[itemId]) {
            await fetchWinners(itemId)
        }
        expandedItems.value.add(itemId)
    }
}

// Fetch winners from API
const fetchWinners = async (itemId) => {
    loadingWinners.value.add(itemId)
    try {
        const response = await itemDistributionAPI.showItemWinners(props.raffleId, itemId)

        itemWinners.value[itemId] = response.data.winners || []
    } catch (error) {
        console.error('Error fetching winners:', error)
        itemWinners.value[itemId] = []
    } finally {
        loadingWinners.value.delete(itemId)
    }
}

// Check if item has winners to show
const shouldShowWinnersButton = (item) => {
    // Show if: ongoing/completed OR has distributed items (remaining < initial)
    return props.raffleStatus !== 'pending' || item.pivot.remaining_quantity < item.pivot.initial_quantity
}

// Open distribute modal
const openDistributeModal = (item) => {
    distributingItem.value = item
    showDistributeModal.value = true
}

// Handle successful distribution
const handleDistributed = (payload) => {
    // Refetch winners for this item
    refetchItemWinners(payload.itemId)
    // Emit to parent to refresh raffle data
    emit('distributed')
}

// Refetch winners for a specific item
const refetchItemWinners = (itemId) => {
    // Clear cache for this item
    delete itemWinners.value[itemId]
    // If currently expanded, refetch
    if (expandedItems.value.has(itemId)) {
        fetchWinners(itemId)
    }
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
                <div class="flex flex-col gap-2">
                    <!-- Item Header -->
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span :class="rarityColors[item.rarity]"
                                    class="px-1.5 py-0.5 rounded text-xs font-medium border capitalize">
                                    {{ item.rarity }}
                                </span>
                                <h3 class="text-sm font-semibold text-white">{{ item.name }}</h3>
                                <!-- Status Badge -->
                                <span v-if="getItemStatus(item).show" :class="getItemStatus(item).class"
                                    class="px-1.5 py-0.5 rounded text-xs font-medium border flex items-center gap-1">
                                    <span v-html="getItemStatus(item).icon"></span>
                                    {{ getItemStatus(item).label }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2.5 text-xs">
                                <div>
                                    <span class="text-gray-400">Category:</span>
                                    <span class="text-gray-200 ml-1">{{ item.category.name }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-400">Initial Quantity:</span>
                                    <span class="text-indigo-400 ml-1 font-medium">{{ item.pivot.initial_quantity
                                    }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-400">Remaining Quantity:</span>
                                    <span class="text-indigo-400 ml-1 font-medium">{{ item.pivot.remaining_quantity
                                    }}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Status Message (only for pending and item still has stock) -->
                    <div v-if="raffleStatus === 'pending' && !isItemComplete(item)"
                        class="bg-blue-500/10 border border-blue-500/30 rounded px-2.5 py-1.5 text-center">
                        <p class="text-xs text-blue-300">Winners will be announced when the raffle draw begins</p>
                    </div>

                    <!-- Distribute Button -->
                    <button v-if="raffleStatus === 'ongoing' && item.pivot.remaining_quantity > 0"
                        @click="openDistributeModal(item)"
                        class="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 rounded px-2.5 py-1.5 text-xs font-medium transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="text-white">Distribute</span>
                    </button>

                    <!-- Winners Toggle Button -->
                    <button v-if="shouldShowWinnersButton(item)" @click="toggleWinners(item)"
                        class="flex items-center justify-between w-full bg-[#1a1a1f] hover:bg-[#20202a] border border-gray-700 rounded px-2.5 py-1.5 text-xs transition-colors">
                        <span class="text-gray-300 font-medium">
                            {{ expandedItems.has(item.id) ? 'Hide Winners' : 'Show Winners' }}
                        </span>
                        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200"
                            :class="{ 'rotate-180': expandedItems.has(item.id) }" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>



                    <!-- Winners List -->
                    <div v-if="expandedItems.has(item.id)"
                        class="bg-[#1a1a1f] border border-gray-700 rounded px-2.5 py-2 space-y-1.5">

                        <!-- Loading State -->
                        <div v-if="loadingWinners.has(item.id)" class="text-center py-2">
                            <svg class="w-4 h-4 animate-spin text-indigo-400 mx-auto" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <p class="text-xs text-gray-400 mt-1">Loading winners...</p>
                        </div>

                        <!-- Winners -->
                        <div v-else-if="itemWinners[item.id] && itemWinners[item.id].length > 0">
                            <div v-for="winner in itemWinners[item.id]" :key="winner.id"
                                class="flex items-center justify-between my-2 py-2 px-2 bg-[#0b0b0d] rounded">
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span class="text-xs text-gray-200 font-medium">{{ winner.name }}</span>
                                </div>
                                <span class="text-xs text-indigo-400 font-medium">x{{ winner.quantity }}</span>
                            </div>
                        </div>

                        <!-- No Winners -->
                        <div v-else class="text-center py-2">
                            <p class="text-xs text-gray-400">No winners yet</p>
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

        <!-- Participant Distribution Modal -->
        <ParticipantDistributionModal v-model="showDistributeModal" :raffleId="raffleId" :item="distributingItem"
            :participants="participants" @distributed="handleDistributed" />
    </div>
</template>