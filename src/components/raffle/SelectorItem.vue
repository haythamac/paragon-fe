<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    allItems: {
        type: Array,
        required: true
    },
    modelValue: {
        type: Array,
        required: true
    },
    raffleName: {
        type: String,
        default: ''
    },
    raffleDate: {
        type: String,
        default: ''
    },
    playerCount: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['update:modelValue'])

const itemSearch = ref('')
const itemTab = ref('all') // 'all', 'tradeable', 'non-tradeable'

// Rarity colors and formatting
const rarityColors = {
    common: 'text-white',
    uncommon: 'text-green-500',
    rare: 'text-blue-500',
    epic: 'text-purple-500',
    legendary: 'text-yellow-500'
}

const rarityMap = {
    common: '[C]',
    uncommon: '[UC]',
    rare: '[R]',
    epic: '[E]',
    legendary: '[L]'
}

function rarityClass(rarity) {
    return rarityColors[rarity] || 'text-gray-200'
}

// Filter items based on search and tab
const filteredItems = computed(() => {
    if (!props.allItems || props.allItems.length === 0) {
        return []
    }

    let items = [...props.allItems]

    // Filter by tab
    if (itemTab.value === 'tradeable') {
        items = items.filter(item => item.is_tradeable === 1 || item.is_tradeable === true)
    } else if (itemTab.value === 'non-tradeable') {
        items = items.filter(item => item.is_tradeable === 0 || item.is_tradeable === false)
    }

    // Filter by search
    if (itemSearch.value) {
        const query = itemSearch.value.toLowerCase()
        items = items.filter(item =>
            item.name?.toLowerCase().includes(query) ||
            item.rarity?.toLowerCase().includes(query)
        )
    }

    return items
})

// Check if item is selected
const isItemSelected = (item) => {
    return props.modelValue.some(i => i.id === item.id)
}

// Toggle item selection
const toggleItem = (item) => {
    if (isItemSelected(item)) {
        // Remove from selection
        const newSelection = props.modelValue.filter(i => i.id !== item.id)
        emit('update:modelValue', newSelection)
    } else {
        // Add to selection with default quantity 1
        emit('update:modelValue', [...props.modelValue, { ...item, quantity: 1 }])
    }
}

// Get item quantity
const getItemQuantity = (itemId) => {
    const item = props.modelValue.find(i => i.id === itemId)
    return item?.quantity || 1
}

// Update item quantity
const updateItemQuantity = (itemId, delta) => {
    const updatedItems = props.modelValue.map(item => {
        if (item.id === itemId) {
            const newQuantity = Math.max(1, (item.quantity || 1) + delta)
            return { ...item, quantity: newQuantity }
        }
        return item
    })
    emit('update:modelValue', updatedItems)
}

// Set item quantity manually
const setItemQuantity = (itemId, value) => {
    const quantity = parseInt(value) || 1
    const validQuantity = Math.max(1, quantity)

    const updatedItems = props.modelValue.map(item => {
        if (item.id === itemId) {
            return { ...item, quantity: validQuantity }
        }
        return item
    })
    emit('update:modelValue', updatedItems)
}

// Select all items in current view
const selectAllItems = () => {
    const itemsToSelect = filteredItems.value
    const newSelections = itemsToSelect.filter(item => !isItemSelected(item))
    emit('update:modelValue', [
        ...props.modelValue,
        ...newSelections.map(item => ({ ...item, quantity: 1 }))
    ])
}

// Clear all items in current view
const clearAllItems = () => {
    const filteredIds = filteredItems.value.map(item => item.id)
    const remaining = props.modelValue.filter(item => !filteredIds.includes(item.id))
    emit('update:modelValue', remaining)
}
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-300">
                Items selected: {{ modelValue.length }}
            </p>
            <div class="flex gap-2">
                <button type="button" @click="selectAllItems"
                    class="text-xs px-2 py-1 rounded bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors">
                    Select All
                </button>
                <button type="button" @click="clearAllItems"
                    class="text-xs px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors">
                    Clear All
                </button>
            </div>
        </div>

        <!-- Tabs for Tradeable/Non-tradeable -->
        <div class="flex gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <button type="button" @click="itemTab = 'all'" :class="[
                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                itemTab === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
            ]">
                All Items
            </button>
            <button type="button" @click="itemTab = 'tradeable'" :class="[
                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                itemTab === 'tradeable'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
            ]">
                Tradeable
            </button>
            <button type="button" @click="itemTab = 'non-tradeable'" :class="[
                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                itemTab === 'non-tradeable'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
            ]">
                Non-tradeable
            </button>
        </div>

        <!-- Search Bar -->
        <div class="relative">
            <input v-model="itemSearch" type="text" placeholder="Search items..."
                class="w-full px-4 py-2 pl-10 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Items Grid -->
        <div class="border border-gray-800 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <div v-if="filteredItems.length > 0" class="grid grid-cols-2 gap-3">
                <div v-for="item in filteredItems" :key="item.id" @click="toggleItem(item)" :class="[
                    'p-3 rounded-lg border-2 transition-all cursor-pointer',
                    isItemSelected(item)
                        ? 'bg-green-900/30 border-green-500'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                ]">
                    <!-- Item header -->
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-2 h-2 rounded-full',
                                isItemSelected(item) ? 'bg-green-500' : 'bg-gray-500'
                            ]"></div>
                            <span :class="['text-sm font-medium', rarityClass(item.rarity)]">
                                {{ rarityMap[item.rarity?.toLowerCase()] || '' }} {{ item.name }}
                                <span v-if="item.is_tradeable" class="italic text-gray-400">[Tradeable]</span>
                            </span>
                        </div>
                        <svg v-if="isItemSelected(item)" class="w-5 h-5 text-green-500" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>

                    <!-- Quantity controls - only show when selected -->
                    <div v-if="isItemSelected(item)" class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700"
                        @click.stop>
                        <span class="text-xs text-gray-400">Quantity:</span>
                        <div class="flex items-center gap-2 ml-auto">
                            <button type="button" @click.stop="updateItemQuantity(item.id, -1)"
                                class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors">
                                <span class="text-lg leading-none">−</span>
                            </button>
                            <input type="number" :value="getItemQuantity(item.id)"
                                @input="setItemQuantity(item.id, $event.target.value)" @click.stop min="1"
                                class="w-12 text-center bg-gray-800 border border-gray-700 rounded text-gray-200 text-sm py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <button type="button" @click.stop="updateItemQuantity(item.id, 1)"
                                class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors">
                                <span class="text-lg leading-none">+</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-12 text-gray-500">
                <svg class="mx-auto h-10 w-10 text-gray-600 mb-3" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p class="text-sm">No items found</p>
            </div>
        </div>

        <!-- Summary -->
        <div class="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-300 mb-2">Raffle Summary</h3>
            <div class="space-y-1 text-sm text-gray-400">
                <p>Name: <span class="text-white">{{ raffleName }}</span></p>
                <p>Date: <span class="text-white">{{ raffleDate }}</span></p>
                <p>Players: <span class="text-white">{{ playerCount }}</span></p>
                <p>Items: <span class="text-white">{{ modelValue.length }}</span></p>
            </div>
        </div>
    </div>
</template>