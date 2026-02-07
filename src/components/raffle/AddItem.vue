<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'
import FieldInput from '../common/FieldInput.vue'
import Dropdown from '../common/Dropdown.vue'
import { toast } from 'vue-sonner'

import { categoryAPI } from '@/services/categoryAPI'
import { itemAPI } from '@/services/itemAPI'

const categories = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const response = await categoryAPI.getAll()
    categories.value = response.data
  } catch (err) {
    console.error(err)
    error.value = err
  } finally {
    loading.value = false
  }
})

const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    label: cat.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: cat.id,
  }))
})

const itemName = ref('')
const tradeable = ref(0)
const selectedRarity = ref('')
const selectedCategory = ref('')


async function handleSubmit(e) {
  e.preventDefault();

  const data = {
    itemName: itemName.value, 
    tradeable: tradeable.value,
    rarity: selectedRarity.value,
    category: selectedCategory.value,
  };

  try {
    await itemAPI.store(data);
    toast.success("Item saved successfully");

    // Reset form
    itemName.value = '';
  } catch (err) {
    console.error("Failed to save item:", err);

    if (err.response && err.response.status === 422) {
      // Laravel validation error
      const errors = err.response.data.errors;

      // Example: show first itemName error if it exists
      if (errors.itemName) {
        toast.error(errors.itemName[0]);
      } else {
        toast.error("Validation failed");
      }
    } else {
      // Fallback for other errors (500, network, etc.)
      toast.error("Item did not save");
    }
  }
}

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)
</script>

<template>
  <div>

    <teleport to="body">
      <transition name="fade">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden="false">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="close"></div>

          <div role="dialog" aria-modal="true"
            class="relative z-10 w-full max-w-md bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
            aria-labelledby="dialog-title">
            <h2 id="dialog-title" class="text-lg font-semibold text-white">Add Item</h2>
            <p class="text-sm text-gray-400 mb-4">Fill in the item details.</p>

            <form @submit="handleSubmit" class="space-y-4">

              <field-input label="Item Name" name="itemName" v-model="itemName" type="text"
                placeholder="Enter item name" required>
              </field-input>

              <div class="flex items-center gap-3">
                <input type="checkbox" id="tradeable" name="tradeable" v-model="tradeable" value="1" :true-value="1"
                  :false-value="0"
                  class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2">
                <label for="tradeable" class="text-sm text-gray-200 cursor-pointer">
                  Tradeable
                </label>
              </div>

              <Dropdown label="Rarity" name="rarity" v-model="selectedRarity" :options="[
                { label: 'Common', value: 'common', color: 'rarity-common' },
                { label: 'Uncommon', value: 'uncommon', color: 'rarity-uncommon' },
                { label: 'Rare', value: 'rare', color: 'rarity-rare' },
                { label: 'Epic', value: 'epic', color: 'rarity-epic' },
                { label: 'Legendary', value: 'legendary', color: 'rarity-legendary' },
              ]" placeholder="Select rarity" required />

              <Dropdown v-if="!loading" label="Category" name="category" v-model="selectedCategory"
                :options="categoryOptions" placeholder="Select category" required />
              <div v-else class="text-sm text-gray-400">Loading categories...</div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" class="px-3 py-2 rounded-md border border-gray-700 text-gray-200 bg-transparent"
                  @click="close">Cancel</button>
                <button type="submit" class="px-4 py-2 rounded-md bg-indigo-600 text-white">Save</button>
              </div>
            </form>
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
