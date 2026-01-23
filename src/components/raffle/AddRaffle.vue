<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'

import FieldInput from '../common/FieldInput.vue'
import ComboBoxInput from '../common/ComboBoxInput.vue'
import StepIndicator from './StepIndicator.vue'
import ItemSelector from './ItemSelector.vue'

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
        
        console.log(raffleData);
        // Replace with your actual API call
        const response = await raffleAPI.store(raffleData)

        console.log('Raffle Data:', raffleData)
        toast.success('Raffle created successfully!')
        close()
    } catch (error) {
        console.error('Error creating raffle:', error)
        toast.error('Failed to create raffle')
    } finally {
        loading.value = false
    }
}


const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
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

                                <!-- ComboBox Input -->
                                <ComboBoxInput v-model="selectedMembers" :items="allMembers" item-text="name"
                                    item-value="id" placeholder="Search and select players..." />

                                <!-- Selected players table -->
                                <div
                                    class="border border-gray-800 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                                    <table v-if="selectedMembers.length > 0" class="w-full text-sm">
                                        <thead class="bg-gray-900 sticky top-0">
                                            <tr>
                                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-400">
                                                    Player</th>
                                                <th class="px-3 py-2 text-right text-xs font-medium text-gray-400">
                                                    Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-800">
                                            <tr v-for="member in selectedMembers" :key="member.id"
                                                class="hover:bg-gray-900/50 transition-colors">
                                                <td class="px-3 py-2">
                                                    <div class="flex items-center gap-2">
                                                        <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                                        <span class="text-gray-200">{{ member.name }}</span>
                                                    </div>
                                                </td>
                                                <td class="px-3 py-2 text-right">
                                                    <button type="button" @click="removeMember(member.id)"
                                                        class="text-red-400 hover:text-red-300 transition-colors text-xs">
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Empty state -->
                                    <div v-else class="text-center py-12 text-gray-500">
                                        <svg class="mx-auto h-10 w-10 text-gray-600 mb-3" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p class="text-sm">No players selected</p>
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
                            <div v-show="currentStep === 2">
                                <ItemSelector :all-items="allItems" :selected-items="selectedItems"
                                    @update:selected-items="selectedItems = $event" />

                                <div class="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mt-6">
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
