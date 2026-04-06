<script setup>
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import Dropdown from '../common/Dropdown.vue'
import FieldInput from '../common/FieldInput.vue'
import { itemAPI } from '@/services/itemAPI'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    itemData: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'item-added'])

const itemName = ref('')
const rarity = ref('')
const category = ref('')
const tradeable = ref(false)
const loading = ref(false)

// Populate form when itemData changes
watch(() => props.itemData, (newData) => {
    if (newData) {
        // Convert game name to display name
        // Remove rarity prefix if exists
        let cleanName = newData.gameName.replace(/^\[[A-Z]+\]\s*/, '')
        
        // Convert Enhancement Tome format
        if (cleanName.startsWith('Enhancement Tome:')) {
            cleanName = cleanName.replace('Enhancement Tome:', '').trim() + ' Tome'
        }
        
        itemName.value = cleanName
        rarity.value = newData.detectedRarity || ''
        category.value = detectCategory(newData.gameName)
        tradeable.value = false // Default to not tradeable
    }
}, { immediate: true })

const detectCategory = (name) => {
    if (name.includes('Blueprint')) return 'Blueprint'
    if (name.includes('Enhancement Tome')) return 'Enhancement Tome'
    if (name.includes('Soul')) return 'Material'
    if (name.includes('Steel') || name.includes('Linen') || name.includes('Jewel') || 
        name.includes('Component') || name.includes('Abrasive') || name.includes('Horn')) {
        return 'Material'
    }
    if (name.includes('Helmet') || name.includes('Gloves') || name.includes('Top') || 
        name.includes('Boots') || name.includes('Ring') || name.includes('Necklace')) {
        return 'Equipment'
    }
    return ''
}

const handleSubmit = async () => {
    if (!itemName.value.trim() || !rarity.value) {
        toast.error('Please fill in required fields')
        return
    }

    loading.value = true
    try {
        await itemAPI.store({
            name: itemName.value.trim(),
            rarity: rarity.value,
            category: category.value || null,
            is_tradeable: tradeable.value
        })

        toast.success('Item added to inventory')
        emit('item-added')
        close()
    } catch (error) {
        console.error('Error adding item:', error)
        
        if (error.response?.status === 422) {
            const errors = error.response.data.errors
            const firstError = Object.values(errors)[0]?.[0]
            toast.error(firstError || 'Validation failed')
        } else {
            toast.error('Failed to add item')
        }
    } finally {
        loading.value = false
    }
}

const close = () => {
    emit('update:modelValue', false)
    // Reset form
    itemName.value = ''
    rarity.value = ''
    category.value = ''
    tradeable.value = false
}
</script>

<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="modelValue" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

                <div class="relative z-10 w-full max-w-md bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800">
                    <h2 class="text-lg font-semibold mb-1">Quick Add Item</h2>
                    <p class="text-sm text-gray-400 mb-4">Add this item to your inventory</p>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <FieldInput
                            v-model="itemName"
                            label="Item Name"
                            placeholder="e.g., Rune of Boosting Tome"
                            required
                        />

                        <Dropdown
                            v-model="rarity"
                            label="Rarity"
                            :options="[
                                { label: 'Common', value: 'common', color: 'rarity-common' },
                                { label: 'Uncommon', value: 'uncommon', color: 'rarity-uncommon' },
                                { label: 'Rare', value: 'rare', color: 'rarity-rare' },
                                { label: 'Epic', value: 'epic', color: 'rarity-epic' },
                                { label: 'Legendary', value: 'legendary', color: 'rarity-legendary' },
                            ]"
                            placeholder="Select rarity"
                            required
                        />

                        <FieldInput
                            v-model="category"
                            label="Category (Optional)"
                            placeholder="e.g., Enhancement Tome, Material, Equipment"
                        />

                        <div>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    v-model="tradeable"
                                    class="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                />
                                <span class="text-sm text-gray-300">Tradeable</span>
                            </label>
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                @click="close"
                                :disabled="loading"
                                class="px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                :disabled="loading"
                                class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {{ loading ? 'Adding...' : 'Add to Inventory' }}
                            </button>
                        </div>
                    </form>
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