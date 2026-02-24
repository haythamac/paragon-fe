<script setup>
import { ref, computed, onMounted } from 'vue'

import FieldInput from '../common/FieldInput.vue'
import StepIndicator from './StepIndicator.vue'

import { toast } from 'vue-sonner'
import { memberAPI } from '@/services/memberAPI'
import { itemAPI } from '@/services/itemAPI'
import { raffleAPI } from '@/services/raffleAPI'
import SelectorPlayer from './SelectorPlayer.vue'
import SelectorBasicInfo from './SelectorBasicInfo.vue'
import SelectorItem from './SelectorItem.vue'

const props = defineProps({
    modelValue: Boolean,
    mode: {
        type: String,
        default: 'add',
        validator: (v) => ['add', 'edit'].includes(v)
    },
    raffleId: {
        type: Number,
        default: null
    }
})

const isEditMode = computed(() => props.mode === 'edit')

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

        // Load raffle data if edit mode
        if (isEditMode.value && props.raffleId) {
            await loadRaffleData()
        }
    } catch (err) {
        errors.value = err
        toast.error('Failed to load members.')
        console.log(err)
    } finally {
        loading.value = false
    }
})

const loadRaffleData = async () => {
    try {
        const response = await raffleAPI.getById(props.raffleId)
        const raffle = response.data.data

        // Populate form
        raffleName.value = raffle.name
        raffleDate.value = raffle.date
        selectedMembers.value = raffle.members || []
        selectedItems.value = (raffle.items || []).map(item => ({
            ...item,
            quantity: item.pivot?.initial_quantity || 1
        }))
    } catch (error) {
        console.error('Error loading raffle:', error)
        toast.error('Failed to load raffle data')
    }
}

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
    const suffix = item.is_tradeable ? '[Tradeable]' : ''
    // Removed the tradeable suffix since it's now separated by tabs
    return `${prefix} ${item.name} ${suffix}`
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

        // Different API call based on mode
        if (isEditMode.value) {
            await raffleAPI.update(props.raffleId, raffleData)
            toast.success('Raffle updated successfully!')
        } else {
            await raffleAPI.store(raffleData)
            toast.success('Raffle created successfully!')
        }

        emit('refresh')
        close()
    } catch (error) {
        console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} raffle:`, error)
        toast.error(`Failed to ${isEditMode.value ? 'update' : 'create'} raffle`)
    } finally {
        loading.value = false
    }
}



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
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">
                            {{ isEditMode ? 'Edit Raffle' : 'Create Raffle' }}
                        </h2>
                        <p class="text-sm text-gray-400 mb-4">Fill in the item details.</p>

                        <!-- Step Indicator -->
                        <StepIndicator :steps="steps" :current-step="currentStep" />

                        <div class="min-h-[400px]">
                            <!-- Step 1: Players Section -->
                            <SelectorPlayer v-show="currentStep === 0" :allMembers="allMembers"
                                v-model="selectedMembers" />

                            <!-- Step 2: Details Section -->
                            <SelectorBasicInfo v-show="currentStep === 1" v-model:name="raffleName"
                                v-model:date="raffleDate" :playerCount="selectedMembers.length" />

                            <!-- Step 3: Items -->
                            <SelectorItem v-show="currentStep === 2" :allItems="allItems" v-model="selectedItems"
                                :raffleName="raffleName" :raffleDate="raffleDate"
                                :playerCount="selectedMembers.length" />

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
                                        {{ loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ?
                                        'Update' : 'Create') }}
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
