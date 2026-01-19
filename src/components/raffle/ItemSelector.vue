<script setup>
import { ref } from 'vue'
import ComboBoxInput from '../common/ComboBoxInput.vue'

const props = defineProps({
  allItems: {
    type: Array,
    required: true,
  },
  selectedItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:selectedItems'])

const updateQuantity = (itemId, delta) => {
  const updatedItems = props.selectedItems.map(item => {
    if (item.id === itemId) {
      const newQuantity = Math.max(1, item.quantity + delta)
      return { ...item, quantity: newQuantity }
    }
    return item
  })
  emit('update:selectedItems', updatedItems)
}

const removeItem = (itemId) => {
  const filtered = props.selectedItems.filter(item => item.id !== itemId)
  emit('update:selectedItems', filtered)
}

const handleItemSelection = (items) => {
  // Add quantity property to newly selected items
  const itemsWithQuantity = items.map(item => ({
    ...item,
    quantity: item.quantity || 1
  }))
  emit('update:selectedItems', itemsWithQuantity)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-gray-300">
        Items selected: {{ selectedItems.length }}
      </p>
    </div>

    <!-- ComboBox Input -->
    <ComboBoxInput 
      :model-value="selectedItems" 
      @update:model-value="handleItemSelection"
      :items="allItems" 
      item-text="name"
      item-value="id" 
      placeholder="Search and select items..." 
    />

    <!-- Selected items table -->
    <div class="border border-gray-800 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
      <table v-if="selectedItems.length > 0" class="w-full text-sm">
        <thead class="bg-gray-900 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-400">Item</th>
            <th class="px-3 py-2 text-center text-xs font-medium text-gray-400">Quantity</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-gray-400">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr 
            v-for="item in selectedItems" 
            :key="item.id"
            class="hover:bg-gray-900/50 transition-colors"
          >
            <td class="px-3 py-2">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span class="text-gray-200">{{ item.name }}</span>
              </div>
            </td>
            <td class="px-3 py-2">
              <div class="flex items-center justify-center gap-2">
                <button
                  type="button"
                  @click="updateQuantity(item.id, -1)"
                  class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors"
                >
                  <span class="text-lg leading-none">−</span>
                </button>
                <span class="w-8 text-center text-gray-200 font-medium">{{ item.quantity }}</span>
                <button
                  type="button"
                  @click="updateQuantity(item.id, 1)"
                  class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors"
                >
                  <span class="text-lg leading-none">+</span>
                </button>
              </div>
            </td>
            <td class="px-3 py-2 text-right">
              <button
                type="button"
                @click="removeItem(item.id)"
                class="text-red-400 hover:text-red-300 transition-colors text-xs"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-else class="text-center py-12 text-gray-500">
        <svg class="mx-auto h-10 w-10 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-sm">No items selected</p>
      </div>
    </div>
  </div>
</template>