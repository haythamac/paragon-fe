<template>
    <div class="relative w-full" ref="dropdownRef">
        <label v-if="label" class="block text-sm font-medium text-gray-300 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-400">*</span>
        </label>

        <!-- Selected value display / Search input -->
        <div class="relative">
            <input v-model="searchQuery" @focus="isOpen = true" @input="isOpen = true" type="text"
                :placeholder="selectedItem ? selectedItem[itemText] : placeholder"
                class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>

        <!-- Dropdown list -->
        <div v-if="isOpen && filteredItems.length > 0"
            class="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <div v-for="item in filteredItems" :key="item[itemValue]" @click="selectItem(item)" :class="[
                'px-4 py-2 cursor-pointer transition-colors',
                isSelected(item)
                    ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900/70'
                    : 'text-gray-300 hover:bg-gray-800'
            ]">
                <div class="flex items-center justify-between">
                    <span class="font-medium">{{ getDisplayText(item) }}</span>
                    <svg v-if="isSelected(item)" class="w-5 h-5 text-indigo-500" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- No results message -->
        <div v-if="isOpen && filteredItems.length === 0"
            class="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 text-center text-gray-500">
            No results found
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    },
    modelValue: {
        type: [Object, Number, String, null],
        default: null
    },
    itemText: {
        type: String,
        default: 'name'
    },
    itemValue: {
        type: String,
        default: 'id'
    },
    placeholder: {
        type: String,
        default: 'Select...'
    },
    label: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    formatDisplay: {
        type: Function,
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const isOpen = ref(false)
const dropdownRef = ref(null)

// Get display text for an item
const getDisplayText = (item) => {
    if (props.formatDisplay) {
        return props.formatDisplay(item)
    }
    return item[props.itemText]
}

// Get selected item object
const selectedItem = computed(() => {
    if (!props.modelValue) return null

    // If modelValue is an object, return it
    if (typeof props.modelValue === 'object') {
        return props.modelValue
    }

    // If modelValue is ID, find the item
    return props.items.find(item => item[props.itemValue] === props.modelValue)
})

// Filter items based on search query
const filteredItems = computed(() => {
    if (!searchQuery.value) {
        return props.items
    }

    const query = searchQuery.value.toLowerCase()
    return props.items.filter(item => {
        const displayText = getDisplayText(item)
        return displayText.toLowerCase().includes(query)
    })
})

// Check if item is selected
const isSelected = (item) => {
    if (!props.modelValue) return false

    if (typeof props.modelValue === 'object') {
        return props.modelValue[props.itemValue] === item[props.itemValue]
    }

    return props.modelValue === item[props.itemValue]
}

// Select item
const selectItem = (item) => {
    emit('update:modelValue', item)
    searchQuery.value = ''
    isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false
        searchQuery.value = ''
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>