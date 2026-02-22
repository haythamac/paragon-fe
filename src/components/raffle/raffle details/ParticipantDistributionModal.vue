<script setup>
import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import SearchableDropdown from '../../common/SearchableDropdown.vue'
import { itemDistributionAPI } from '@/services/itemDistributionAPI'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    raffleId: {
        type: [Number, String],
        required: true
    },
    item: {
        type: Object,
        required: true
    },
    participants: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'distributed'])

const selectedParticipant = ref(null)
const quantity = ref(1)
const loading = ref(false)

// Reset form when modal opens/closes
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        // Reset when opening
        selectedParticipant.value = null
        quantity.value = 1
    }
})

// Rarity colors
const rarityColors = {
    epic: 'text-red-300',
    legendary: 'text-yellow-300',
    rare: 'text-blue-300',
    uncommon: 'text-green-300',
    common: 'text-gray-300'
}

const rarityClass = computed(() => {
    return rarityColors[props.item?.rarity] || 'text-gray-300'
})

const updateQuantity = (delta) => {
    const newQuantity = quantity.value + delta
    if (newQuantity >= 1 && newQuantity <= props.item.pivot.remaining_quantity) {
        quantity.value = newQuantity
    }
}

const canSubmit = computed(() => {
    return selectedParticipant.value &&
        quantity.value >= 1 &&
        quantity.value <= props.item.pivot.remaining_quantity &&
        !loading.value
})

const handleSubmit = async () => {
    if (!canSubmit.value) return

    loading.value = true
    try {
        await itemDistributionAPI.manualStore(
            props.raffleId,
            {
                raffle_id: props.raffleId,
                member_id: selectedParticipant.value.id,
                items: [
                    {
                        item_id: props.item.id,
                        quantity: quantity.value
                    }
                ]
            }
        )

        toast.success(`Distributed ${quantity.value}x ${props.item.name} to ${selectedParticipant.value.name}`)

        emit('distributed', {
            itemId: props.item.id,
            participantId: selectedParticipant.value.id,
            quantity: quantity.value
        })

        close()
    } catch (error) {
        console.error('Error distributing item:', error)

        if (error.response?.status === 422) {
            const errors = error.response.data.errors
            const firstError = Object.values(errors)[0]?.[0]
            toast.error(firstError || 'Validation failed')
        } else {
            toast.error('Failed to distribute item')
        }
    } finally {
        loading.value = false
    }
}

const close = () => {
    emit('update:modelValue', false)
}
</script>

<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

                <div class="relative z-10 w-full max-w-md bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                    role="dialog" aria-modal="true">
                    <!-- Header -->
                    <h2 class="text-lg font-semibold text-white mb-1">Distribute Item</h2>
                    <p class="text-sm text-gray-400 mb-4">Select a participant and quantity to distribute</p>

                    <!-- Item Info -->
                    <div class="bg-[#13131a] border border-gray-700 rounded-lg p-3 mb-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">Item</p>
                                <p class="text-sm font-semibold" :class="rarityClass">
                                    {{ item.name }}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-gray-400 mb-1">Available</p>
                                <p class="text-sm font-semibold text-indigo-400">
                                    {{ item.pivot.remaining_quantity }} remaining
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Form -->
                    <div class="space-y-4">
                        <!-- Participant Selection -->
                        <SearchableDropdown v-model="selectedParticipant" :items="participants" item-text="name"
                            item-value="id" label="Select Participant" placeholder="Search participants..." required />

                        <!-- Quantity -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">
                                Quantity <span class="text-red-400">*</span>
                            </label>
                            <div class="flex items-center justify-center gap-3">
                                <button type="button" @click="updateQuantity(-1)" :disabled="quantity <= 1"
                                    class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 flex items-center justify-center transition-colors">
                                    <span class="text-xl leading-none">−</span>
                                </button>
                                <span class="w-16 text-center text-lg text-gray-200 font-medium">
                                    {{ quantity }}
                                </span>
                                <button type="button" @click="updateQuantity(1)"
                                    :disabled="quantity >= item.pivot.remaining_quantity"
                                    class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 flex items-center justify-center transition-colors">
                                    <span class="text-xl leading-none">+</span>
                                </button>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button"
                                class="px-4 py-2 rounded-lg border border-gray-700 text-gray-200 bg-transparent hover:bg-gray-800 transition-colors"
                                @click="close" :disabled="loading">
                                Cancel
                            </button>
                            <button type="button"
                                class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                @click="handleSubmit" :disabled="!canSubmit">
                                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>{{ loading ? 'Distributing...' : 'Distribute' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
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