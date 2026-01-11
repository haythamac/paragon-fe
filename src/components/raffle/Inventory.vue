<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'

import { categoryAPI } from '@/services/categoryAPI'
import { itemAPI } from '@/services/itemAPI'
import InventoryItem from './InventoryItem.vue'
import { Input } from '@/components/ui/input'

const categories = ref([])
const searchQuery = ref('')
const items = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const categoryResponse = await categoryAPI.getAll()
    categories.value = categoryResponse.data

    const itemResponse = await itemAPI.getAll()
    items.value = itemResponse.data
  } catch (err) {
    console.error(err)
    error.value = err
  } finally {
    loading.value = false
  }
})

const categoryMap = computed(() => {
  const map = {}
  categories.value.forEach(cat => {
    map[cat.id] = cat.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })
  return map
})

// Filtered items based on search query
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return items.value
  }

  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

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
                        class="relative z-10 w-full max-w-4xl bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                        aria-labelledby="dialog-title">
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">Inventory</h2>
                        <p class="text-sm text-gray-400 mb-4">All items are listed here.</p>
                        <div class="flex justify-between items-center mb-4">
                          <Input class="w-48" v-model="searchQuery"/>
                          <div>
                            Filter
                          </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                          
                          <InventoryItem
                          v-for="item in filteredItems"
                          :key="item.id"
                          :itemName="item.name"
                          :rarity="item.rarity"
                          :category="categoryMap[item.item_category_id]"
                          :image="item.image || 'https://placehold.co/150?text=Weapon'" />
                          
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
