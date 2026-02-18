<script setup>
import { ref, computed, onMounted } from 'vue'

import FieldInput from '../common/FieldInput.vue'
import StepIndicator from './StepIndicator.vue'

import { toast } from 'vue-sonner'
import { memberAPI } from '@/services/memberAPI'
import { itemAPI } from '@/services/itemAPI'
import { raffleAPI } from '@/services/raffleAPI'

const loading = ref(false)
const currentStep = ref(0)
const errors = ref([])
const memberSearch = ref('')

// Players  data
const allMembers = ref([])
const selectedMembers = ref([])

// Step 2: Details
const raffleName = ref('')
const raffleDate = ref('')

// Step 3: Items
const allItems = ref([])
const selectedItems = ref([])

const steps = [
    { label: 'Players', icon: '👥' },
    { label: 'Details', icon: '📝' },
    { label: 'Items', icon: '📦' },
]

onMounted(async () => {
    loading.value = true
    try {
        const memberResponse = await memberAPI.getAll();
        allMembers.value = memberResponse.data.data;

        const itemResponse = await itemAPI.getAll();
        allItems.value = itemResponse.data.data;
    } catch (err) {
        errors.value = err
        toast.error('Failed to load members.')
        console.log(err)
    } finally {
        loading.value = false
    }
})

// Validation for each step
const isStep1Valid = computed(() => {
    return selectedMembers.value.length > 0
})

const isStep2Valid = computed(() => {
    return raffleName.value.trim() !== '' && raffleDate.value !== ''
})

const canGoNext = computed(() => {
    if (currentStep.value === 0) return isStep1Valid.value
    if (currentStep.value === 1) return isStep2Valid.value
    return true
})

const canGoBack = computed(() => {
    return currentStep.value > 0
})

const isLastStep = computed(() => {
    return currentStep.value === steps.length - 1
})

// Navigation
const nextStep = () => {
    if (canGoNext.value && currentStep.value < steps.length - 1) {
        currentStep.value++
    }
}

const prevStep = () => {
    if (canGoBack.value) {
        currentStep.value--
    }
}

// Member management
const selectAll = () => {
    selectedMembers.value = [...allMembers.value]
}

const clearAll = () => {
    selectedMembers.value = []
}

const removeMember = (memberId) => {
    selectedMembers.value = selectedMembers.value.filter(m => m.id !== memberId)
}

// Filter members based on search
const filteredMembers = computed(() => {
    if (!memberSearch.value) {
        return allMembers.value
    }
    const query = memberSearch.value.toLowerCase()
    return allMembers.value.filter(member =>
        member.name.toLowerCase().includes(query)
    )
})

// Check if member is selected
const isMemberSelected = (member) => {
    return selectedMembers.value.some(m => m.id === member.id)
}

// Toggle member selection
const toggleMember = (member) => {
    if (isMemberSelected(member)) {
        // Remove from selection
        selectedMembers.value = selectedMembers.value.filter(m => m.id !== member.id)
    } else {
        // Add to selection
        selectedMembers.value = [...selectedMembers.value, member]
    }
}

// Add item search variable (near the top with other refs)
const itemSearch = ref('')

// Add item tab variable (near the top with other refs)
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

function formatItemName(item) {
    const prefix = rarityMap[item.rarity?.toLowerCase()] || ''
    // Removed the tradeable suffix since it's now separated by tabs
    return `${prefix} ${item.name}`
}

// Filter items based on search
const filteredItems = computed(() => {
    // Safety check
    if (!allItems.value || allItems.value.length === 0) {
        return []
    }

    let items = [...allItems.value]

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

// Add manual quantity setter
const setItemQuantity = (itemId, value) => {
    const quantity = parseInt(value) || 1
    const validQuantity = Math.max(1, quantity)

    selectedItems.value = selectedItems.value.map(item => {
        if (item.id === itemId) {
            return { ...item, quantity: validQuantity }
        }
        return item
    })
}

// Check if item is selected
const isItemSelected = (item) => {
    return selectedItems.value.some(i => i.id === item.id)
}

// Toggle item selection
const toggleItem = (item) => {
    if (isItemSelected(item)) {
        // Remove from selection
        selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
    } else {
        // Add to selection with default quantity 1
        selectedItems.value = [...selectedItems.value, { ...item, quantity: 1 }]
    }
}

// Get item quantity
const getItemQuantity = (itemId) => {
    const item = selectedItems.value.find(i => i.id === itemId)
    return item?.quantity || 1
}

// Update item quantity
const updateItemQuantity = (itemId, delta) => {
    selectedItems.value = selectedItems.value.map(item => {
        if (item.id === itemId) {
            const newQuantity = Math.max(1, (item.quantity || 1) + delta)
            return { ...item, quantity: newQuantity }
        }
        return item
    })
}

// Select/clear all items - use filteredItems to respect tab selection
const selectAllItems = () => {
    // Get current filtered items
    const itemsToSelect = filteredItems.value

    // Add them to selection if not already selected
    const newSelections = itemsToSelect.filter(item => !isItemSelected(item))

    selectedItems.value = [
        ...selectedItems.value,
        ...newSelections.map(item => ({ ...item, quantity: 1 }))
    ]
}


const clearAllItems = () => {
    // Only clear items that are in current filtered view
    const filteredIds = filteredItems.value.map(item => item.id)
    selectedItems.value = selectedItems.value.filter(item => !filteredIds.includes(item.id))
}

// Form submission
const handleSubmit = async () => {
    if (!isStep1Valid.value || !isStep2Valid.value) {
        toast.error('Please complete all required fields')
        return
    }

    loading.value = true
    try {
        const raffleData = {
            name: raffleName.value,
            date: raffleDate.value,
            members: selectedMembers.value.map(m => m.id),
            items: selectedItems.value.map(item => ({
                id: item.id,
                quantity: item.quantity
            })),
            status: 'pending'
        }

        const response = await raffleAPI.store(raffleData)

        toast.success('Raffle created successfully!')
        emit('refresh')
        close()
    } catch (error) {
        console.error('Error creating raffle:', error)
        toast.error('Failed to create raffle')
    } finally {
        loading.value = false
    }
}


const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'refresh'])
const close = () => {
    emit('update:modelValue', false)
    // Reset form
    currentStep.value = 0
    selectedMembers.value = []
    raffleName.value = ''
    raffleDate.value = ''
    selectedItems.value = []
}
</script>

<template>
    <div>

        <teleport to="body">
            <transition name="fade">
                <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                    aria-hidden="false">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="close"></div>

                    <div role="dialog" aria-modal="true"
                        class="relative z-10 w-full max-w-5xl bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                        aria-labelledby="dialog-title">
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">Create Raffle</h2>
                        <p class="text-sm text-gray-400 mb-4">Fill in the item details.</p>

                        <!-- Step Indicator -->
                        <StepIndicator :steps="steps" :current-step="currentStep" />

                        <div class="min-h-[400px]">
                            <!-- Step 1: Players Section -->
                            <div v-show="currentStep === 0" class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <p class="text-sm font-medium text-gray-300">
                                        Players selected: {{ selectedMembers.length }}
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
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <!-- Players Grid -->
                                <div class="border border-gray-800 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                                    <div v-if="filteredMembers.length > 0" class="grid grid-cols-3 gap-3">
                                        <div v-for="member in filteredMembers" :key="member.id"
                                            @click="toggleMember(member)" :class="[
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
                                                <svg v-if="isMemberSelected(member)" class="w-5 h-5 text-green-500"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Empty state -->
                                    <div v-else class="text-center py-12 text-gray-500">
                                        <svg class="mx-auto h-10 w-10 text-gray-600 mb-3" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p class="text-sm">No players found</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2: Details Section -->
                            <div v-show="currentStep === 1" class="space-y-4 max-w-md mx-auto">
                                <field-input label="Raffle name" v-model="raffleName" name="raffleName" type="text"
                                    placeholder="What is this raffle for?" required />

                                <field-input label="Raffle date" v-model="raffleDate" name="raffleDate" type="date"
                                    required />

                                <div class="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mt-6">
                                    <h3 class="text-sm font-medium text-gray-300 mb-2">Summary</h3>
                                    <div class="space-y-1 text-sm text-gray-400">
                                        <p>Players: <span class="text-white">{{ selectedMembers.length }}</span></p>
                                        <p v-if="raffleName">Name: <span class="text-white">{{ raffleName }}</span></p>
                                        <p v-if="raffleDate">Date: <span class="text-white">{{ raffleDate }}</span></p>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 3: Items -->
                            <div v-show="currentStep === 2" class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <p class="text-sm font-medium text-gray-300">
                                        Items selected: {{ selectedItems.length }}
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
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <!-- Items Grid -->
                                <div class="border border-gray-800 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                                    <div v-if="filteredItems.length > 0" class="grid grid-cols-2 gap-3">
                                        <div v-for="item in filteredItems" :key="item.id" @click="toggleItem(item)"
                                            :class="[
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
                                                    <span :class="[
                                                        'text-sm font-medium',
                                                        rarityClass(item.rarity)
                                                    ]">
                                                        {{ formatItemName(item) }}
                                                    </span>
                                                </div>
                                                <svg v-if="isItemSelected(item)" class="w-5 h-5 text-green-500"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>

                                            <!-- Quantity controls - only show when selected -->
                                            <div v-if="isItemSelected(item)"
                                                class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700"
                                                @click.stop>
                                                <span class="text-xs text-gray-400">Quantity:</span>
                                                <div class="flex items-center gap-2 ml-auto">
                                                    <button type="button" @click.stop="updateItemQuantity(item.id, -1)"
                                                        class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors">
                                                        <span class="text-lg leading-none">−</span>
                                                    </button>
                                                    <input type="number" :value="getItemQuantity(item.id)"
                                                        @input="setItemQuantity(item.id, $event.target.value)"
                                                        @click.stop min="1"
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
                                        <svg class="mx-auto h-10 w-10 text-gray-600 mb-3" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
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
                                        <p>Players: <span class="text-white">{{ selectedMembers.length }}</span></p>
                                        <p>Items: <span class="text-white">{{ selectedItems.length }}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-between gap-2 pt-6 mt-6 border-t border-gray-800">
                                <button type="button" @click="prevStep" :disabled="!canGoBack"
                                    class="px-4 py-2 rounded-md border border-gray-700 text-gray-200 bg-transparent hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                    Back
                                </button>

                                <div class="flex gap-2">
                                    <button type="button"
                                        class="px-3 py-2 rounded-md border border-gray-700 text-gray-200 bg-transparent hover:bg-gray-800 transition-colors"
                                        @click="close" :disabled="loading">
                                        Cancel
                                    </button>

                                    <button v-if="!isLastStep" type="button" @click="nextStep" :disabled="!canGoNext"
                                        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600">
                                        Next
                                    </button>

                                    <button v-else type="button" @click="handleSubmit" :disabled="loading"
                                        class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {{ loading ? 'Submitting...' : 'Submit' }}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
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
