<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    participant: Object,
    availableItems: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'distribute'])

const itemSearchQuery = ref('')
const selectedRarity = ref('all')
const selectedItems = ref([])

const rarityColors = {
    epic: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    legendary: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    rare: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    common: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
}

const rarities = [
    { value: 'all', label: 'All Rarities' },
    { value: 'legendary', label: 'Legendary' },
    { value: 'epic', label: 'Epic' },
    { value: 'rare', label: 'Rare' },
    { value: 'common', label: 'Common' }
]

const filteredItems = computed(() => {
    let filtered = props.availableItems

    // Search filter - starts with query
    if (itemSearchQuery.value) {
        const query = itemSearchQuery.value.toLowerCase()
        filtered = filtered.filter(item =>
            item.name.toLowerCase().startsWith(query)
        )
    }

    // Rarity filter (no functionality for now as requested)
    // if (selectedRarity.value !== 'all') {
    //   filtered = filtered.filter(item => item.rarity === selectedRarity.value)
    // }

    return filtered
})

const selectedItemsCount = computed(() => {
    return selectedItems.value.length
})

const toggleItemSelection = (item) => {
    const index = selectedItems.value.findIndex(i => i.id === item.id)
    if (index > -1) {
        selectedItems.value.splice(index, 1)
    } else {
        selectedItems.value.push({ ...item, quantity: 1 })
    }
}

const isItemSelected = (itemId) => {
    return selectedItems.value.some(i => i.id === itemId)
}

const updateItemQuantity = (itemId, quantity) => {
    const item = selectedItems.value.find(i => i.id === itemId)
    if (item) {
        const maxStock = getItemStock(itemId)
        item.quantity = Math.max(1, Math.min(parseInt(quantity) || 1, maxStock))
    }
}

const getItemStock = (itemId) => {
    const item = props.availableItems.find(i => i.id === itemId)
    return item ? item.stock : 0
}

const getSelectedItem = (itemId) => {
    return selectedItems.value.find(i => i.id === itemId)
}

const handleClose = () => {
    selectedItems.value = []
    itemSearchQuery.value = ''
    selectedRarity.value = 'all'
    emit('close')
}

const handleDistribute = () => {
    emit('distribute', {
        participant: props.participant,
        items: selectedItems.value
    })
    selectedItems.value = []
    itemSearchQuery.value = ''
    selectedRarity.value = 'all'
}
</script>

<template>
    <!-- Modal Overlay -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        @click.self="handleClose">
        <!-- Modal Content -->
        <div class="bg-[#0b0b0d] border border-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="border-b border-gray-800 p-4">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-lg font-bold text-white">Distribute Items</h2>
                    <button @click="handleClose" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div v-if="participant" class="text-sm text-gray-400">
                    To: <span class="text-indigo-400 font-medium">{{ participant.name }}</span>
                    <span class="text-gray-500 mx-2">•</span>
                    <span class="text-gray-300">{{ participant.class }}</span>
                </div>
            </div>

            <!-- Search and Filter -->
            <div class="p-4 space-y-3 border-b border-gray-800">
                <!-- Search Bar -->
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input v-model="itemSearchQuery" type="text" placeholder="Search items by name..."
                        class="w-full bg-[#1a1a1f] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>

                <!-- Rarity Filter -->
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                    <select v-model="selectedRarity"
                        class="w-full bg-[#1a1a1f] border border-gray-700 rounded-lg pl-9 pr-8 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer">
                        <option v-for="rarity in rarities" :key="rarity.value" :value="rarity.value">
                            {{ rarity.label }}
                        </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Items List -->
            <div class="flex-1 overflow-y-auto p-4">
                <div v-if="filteredItems.length > 0" class="space-y-2">
                    <div v-for="item in filteredItems" :key="item.id" @click="toggleItemSelection(item)"
                        class="bg-[#13131a] border rounded-lg p-3 cursor-pointer transition-colors"
                        :class="isItemSelected(item.id) ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-gray-600'">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1.5">
                                    <!-- Checkbox -->
                                    <div class="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                                        :class="isItemSelected(item.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-600'">
                                        <svg v-if="isItemSelected(item.id)" class="w-3 h-3 text-white" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>

                                    <h3 class="text-sm font-semibold text-white">{{ item.name }}</h3>
                                    <span :class="rarityColors[item.rarity]"
                                        class="px-2 py-0.5 rounded text-xs font-medium border capitalize">
                                        {{ item.rarity }}
                                    </span>
                                </div>

                                <div class="flex items-center gap-3 text-xs ml-6">
                                    <div>
                                        <span class="text-gray-400">Category:</span>
                                        <span class="text-gray-200 ml-1">{{ item.category }}</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-400">Stock:</span>
                                        <span class="text-gray-200 ml-1">{{ item.stock }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Quantity Input -->
                            <div v-if="isItemSelected(item.id)" class="flex items-center gap-2" @click.stop>
                                <label class="text-xs text-gray-400">Qty:</label>
                                <input type="number" :value="getSelectedItem(item.id)?.quantity || 1"
                                    @input="updateItemQuantity(item.id, $event.target.value)" min="1" :max="item.stock"
                                    class="w-16 bg-[#1a1a1f] border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12">
                    <svg class="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p class="text-gray-400 text-sm">No items found</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-800 p-4 flex items-center justify-between gap-3">
                <div class="text-sm text-gray-400">
                    <span v-if="selectedItemsCount > 0">
                        {{ selectedItemsCount }} {{ selectedItemsCount === 1 ? 'item' : 'items' }} selected
                    </span>
                    <span v-else>No items selected</span>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="handleClose"
                        class="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Cancel
                    </button>
                    <button @click="handleDistribute" :disabled="selectedItemsCount === 0"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
                        :class="selectedItemsCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'">
                        Distribute ({{ selectedItemsCount }})
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>