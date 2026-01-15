<template>
  <div class="relative w-full" ref="comboboxRef">
    <!-- Input with search -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @focus="isOpen = true"
        @input="isOpen = true"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Dropdown list -->
    <div
      v-if="isOpen && filteredItems.length > 0"
      class="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
    >
      <div
        v-for="item in filteredItems"
        :key="item[itemValue]"
        @click="toggleSelection(item)"
        :class="[
          'px-4 py-2 cursor-pointer transition-colors',
          isSelected(item) 
            ? 'bg-green-900/50 text-green-300 hover:bg-green-900/70' 
            : 'text-gray-300 hover:bg-gray-800'
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ item[itemText] }}</span>
          <div v-if="isSelected(item)" class="flex items-center gap-2">
            <span class="text-xs text-green-400">Selected</span>
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- No results message -->
    <div
      v-if="isOpen && filteredItems.length === 0"
      class="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 text-center text-gray-500"
    >
      No players found
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: Array,
    required: true,
    default: () => []
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
    default: 'Search players...'
  }
});

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref('');
const isOpen = ref(false);
const comboboxRef = ref(null);

// Filter items based on search query
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return props.items;
  }
  
  const query = searchQuery.value.toLowerCase();
  return props.items.filter(item => 
    item[props.itemText].toLowerCase().includes(query)
  );
});

// Check if item is selected
const isSelected = (item) => {
  return props.modelValue.some(
    selected => selected[props.itemValue] === item[props.itemValue]
  );
};

// Toggle selection
const toggleSelection = (item) => {
  const isCurrentlySelected = isSelected(item);
  
  let newSelection;
  if (isCurrentlySelected) {
    // Remove from selection
    newSelection = props.modelValue.filter(
      selected => selected[props.itemValue] !== item[props.itemValue]
    );
  } else {
    // Add to selection
    newSelection = [...props.modelValue, item];
  }
  
  emit('update:modelValue', newSelection);
  searchQuery.value = ''; // Clear search after selection
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (comboboxRef.value && !comboboxRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>