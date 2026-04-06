<script setup>
import { ref, computed } from 'vue'
import { parseWarehouseLog, matchItems } from '@/utils/warehouseParser'
import { toast } from 'vue-sonner'
import QuickAddItem from './QuickAddItem.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    existingItems: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'items-selected', 'refresh-items'])

const rawText = ref('')
const parsedItems = ref(null)
const selectedExactMatches = ref([])
const showQuickAdd = ref(false)
const currentNewItem = ref(null)

const step = ref(1) // 1 = paste, 2 = review

const parseLog = () => {
    if (!rawText.value.trim()) {
        toast.error('Please paste warehouse log data')
        return
    }

    try {
        const parsed = parseWarehouseLog(rawText.value)
        
        if (parsed.length === 0) {
            toast.error('No items detected. Check the format.')
            return
        }

        const matched = matchItems(parsed, props.existingItems)
        parsedItems.value = matched
        
        // Auto-select all exact matches
        selectedExactMatches.value = matched.exactMatches.map(item => item.gameName)
        
        step.value = 2
        toast.success(`Parsed ${parsed.length} items`)
    } catch (error) {
        console.error('Parse error:', error)
        toast.error('Failed to parse log. Check the format.')
    }
}

const toggleExactMatch = (gameName) => {
    const index = selectedExactMatches.value.indexOf(gameName)
    if (index > -1) {
        selectedExactMatches.value.splice(index, 1)
    } else {
        selectedExactMatches.value.push(gameName)
    }
}

const isSelected = (gameName) => {
    return selectedExactMatches.value.includes(gameName)
}

const addToRaffle = () => {
    const itemsToAdd = parsedItems.value.exactMatches
        .filter(item => isSelected(item.gameName))
        .map(item => ({
            ...item.matchedItem,
            quantity: item.total
        }))

    if (itemsToAdd.length === 0) {
        toast.error('No items selected')
        return
    }

    emit('items-selected', itemsToAdd)
    close()
    toast.success(`Added ${itemsToAdd.length} items to raffle`)
}

const openQuickAdd = (item) => {
    currentNewItem.value = item
    showQuickAdd.value = true
}

const handleItemAdded = () => {
    showQuickAdd.value = false
    emit('refresh-items')
    
    // Re-parse to update matches
    setTimeout(() => {
        parseLog()
    }, 500)
}

const close = () => {
    emit('update:modelValue', false)
    reset()
}

const reset = () => {
    rawText.value = ''
    parsedItems.value = null
    selectedExactMatches.value = []
    step.value = 1
}

const backToStep1 = () => {
    step.value = 1
}
</script>

<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

                <div class="relative z-10 w-full max-w-4xl bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800 max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-lg font-semibold">Import from Warehouse Log</h2>
                            <p class="text-sm text-gray-400">Paste your clan warehouse log to quickly add items</p>
                        </div>
                        <button @click="close" class="text-gray-400 hover:text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Step 1: Paste -->
                    <div v-if="step === 1" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">
                                Paste Warehouse Log
                            </label>
                            <textarea
                                v-model="rawText"
                                placeholder="Enhancement Tome: Control Weight	1	Sanctuary of Bonding...
[C] Soul	2	Sanctuary of Bonding...
Higher Steel	3	Vale of Ragnarok..."
                                rows="12"
                                class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                            ></textarea>
                            <p class="text-xs text-gray-500 mt-1">
                                Copy from game (Ctrl+C) and paste here (Ctrl+V)
                            </p>
                        </div>

                        <div class="flex justify-end gap-2">
                            <button
                                @click="close"
                                class="px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                @click="parseLog"
                                class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            >
                                Parse Log
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Review -->
                    <div v-if="step === 2 && parsedItems" class="space-y-4">
                        <!-- Exact Matches -->
                        <div v-if="parsedItems.exactMatches.length > 0">
                            <h3 class="text-sm font-semibold text-green-400 mb-2">
                                ✓ Exact Matches ({{ parsedItems.exactMatches.length }})
                            </h3>
                            <div class="space-y-2 max-h-60 overflow-y-auto">
                                <label
                                    v-for="item in parsedItems.exactMatches"
                                    :key="item.gameName"
                                    class="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        :checked="isSelected(item.gameName)"
                                        @change="toggleExactMatch(item.gameName)"
                                        class="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <div class="flex-1">
                                        <p class="text-sm text-white font-medium">{{ item.matchedItem.name }}</p>
                                        <p class="text-xs text-gray-400">
                                            Total: {{ item.total }} 
                                            <span class="ml-2">•</span>
                                            <span class="ml-2 capitalize">{{ item.matchedItem.rarity }}</span>
                                            <span v-if="item.matchedItem.is_tradeable" class="ml-2">[Tradeable]</span>
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- No Matches -->
                        <div v-if="parsedItems.noMatches.length > 0">
                            <h3 class="text-sm font-semibold text-yellow-400 mb-2">
                                ⚠ No Match - Add to Inventory ({{ parsedItems.noMatches.length }})
                            </h3>
                            <div class="space-y-2 max-h-60 overflow-y-auto">
                                <div
                                    v-for="item in parsedItems.noMatches"
                                    :key="item.gameName"
                                    class="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                                >
                                    <div class="flex-1">
                                        <p class="text-sm text-white">{{ item.gameName }}</p>
                                        <p class="text-xs text-gray-400">
                                            Total: {{ item.total }}
                                            <span v-if="item.detectedRarity" class="ml-2 capitalize">
                                                • Detected: {{ item.detectedRarity }}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        @click="openQuickAdd(item)"
                                        class="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                                    >
                                        Add to Inventory
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-between gap-2 pt-4 border-t border-gray-800">
                            <button
                                @click="backToStep1"
                                class="px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                @click="addToRaffle"
                                :disabled="selectedExactMatches.length === 0"
                                class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add {{ selectedExactMatches.length }} Items to Raffle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Quick Add Item Modal -->
        <QuickAddItem
            v-model="showQuickAdd"
            :item-data="currentNewItem"
            @item-added="handleItemAdded"
        />
    </teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 160ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>