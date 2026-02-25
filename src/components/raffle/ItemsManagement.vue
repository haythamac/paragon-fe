<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import InventoryItem from './InventoryItem.vue'
import FieldInput from '../common/FieldInput.vue'
import Dropdown from '../common/Dropdown.vue'
import { Input } from '@/components/ui/input'
import { categoryAPI } from '@/services/categoryAPI'
import { itemAPI } from '@/services/itemAPI'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'refresh'])

const categories = ref([])
const items = ref([])
const loading = ref(false)
const error = ref(null)

// Add form state
const showAddForm = ref(false)
const itemName = ref('')
const tradeable = ref(0)
const selectedRarity = ref('')
const selectedCategory = ref('')

// Search state
const searchQuery = ref('')

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const categoryResponse = await categoryAPI.getAll()
    categories.value = categoryResponse.data

    const itemResponse = await itemAPI.getAll()
    items.value = itemResponse.data.data
  } catch (err) {
    console.error(err)
    error.value = err
    toast.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

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

const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    label: cat.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: cat.id,
  }))
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

// Check for exact name match
const exactMatch = computed(() => {
  if (!itemName.value || itemName.value.length < 2) return null
  
  return items.value.find(item => 
    item.name.toLowerCase() === itemName.value.toLowerCase()
  )
})

// Update search when typing in add form name input
const handleNameInput = (value) => {
  itemName.value = value
  searchQuery.value = value // Sync search with name input
}

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value
  
  // Reset form when closing
  if (!showAddForm.value) {
    resetForm()
  }
}

const resetForm = () => {
  itemName.value = ''
  tradeable.value = 0
  selectedRarity.value = ''
  selectedCategory.value = ''
  searchQuery.value = ''
}

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = {
    itemName: itemName.value,
    tradeable: tradeable.value,
    rarity: selectedRarity.value,
    category: selectedCategory.value,
  }

  loading.value = true
  try {
    await itemAPI.store(data)
    toast.success('Item saved successfully')
    
    // Reload items
    await loadData()
    
    // Reset and close form
    resetForm()
    showAddForm.value = false
    
    emit('refresh')
  } catch (err) {
    console.error('Failed to save item:', err)

    if (err.response && err.response.status === 422) {
      const errors = err.response.data.errors
      if (errors.itemName) {
        toast.error(errors.itemName[0])
      } else {
        toast.error('Validation failed')
      }
    } else {
      toast.error('Item did not save')
    }
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('update:modelValue', false)
  resetForm()
  showAddForm.value = false
}
</script>

<template>
  <div>
    <teleport to="body">
      <transition name="fade">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="close"></div>

          <div role="dialog" aria-modal="true"
            class="relative z-10 w-full max-w-4xl bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800">
            
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-semibold text-white">Inventory</h2>
                <p class="text-sm text-gray-400">Manage items</p>
              </div>
              <button @click="close" class="text-gray-400 hover:text-gray-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Search and Add Button -->
            <div class="flex gap-2 mb-4">
              <Input 
                class="flex-1" 
                v-model="searchQuery" 
                placeholder="Search items..."
              />
              <button 
                @click="toggleAddForm"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                :class="showAddForm 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'"
              >
                {{ showAddForm ? 'Cancel' : '+ Add' }}
              </button>
            </div>

            <!-- Add Item Form (Inline) -->
            <transition name="slide-down">
              <div v-if="showAddForm" class="mb-4 p-4 bg-[#13131a] border border-gray-700 rounded-lg">
                <form @submit="handleSubmit" class="space-y-3">
                  <!-- Name Input -->
                  <div>
                    <field-input 
                      label="Item Name" 
                      name="itemName" 
                      :modelValue="itemName"
                      @update:modelValue="handleNameInput"
                      type="text"
                      placeholder="Enter item name" 
                      required
                    />
                    
                    <!-- Exact Match Warning -->
                    <div v-if="exactMatch" class="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs">
                      <div class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        <div>
                          <p class="text-blue-300 font-medium">Note: "{{ exactMatch.name }}" already exists</p>
                          <p class="text-blue-400/80 mt-0.5">
                            [{{ exactMatch.rarity }}] [{{ categoryMap[exactMatch.item_category_id] }}] 
                            {{ exactMatch.is_tradeable ? '[Tradeable]' : '' }}
                          </p>
                          <p class="text-blue-400/60 mt-1">You can still add if this is different</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Form Row: Rarity, Category, Tradeable -->
                  <div class="grid grid-cols-2 gap-3">
                    <Dropdown 
                      label="Rarity" 
                      name="rarity" 
                      v-model="selectedRarity" 
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

                    <Dropdown 
                      v-if="!loading" 
                      label="Category" 
                      name="category" 
                      v-model="selectedCategory"
                      :options="categoryOptions" 
                      placeholder="Select category" 
                      required 
                    />
                  </div>

                  <!-- Tradeable Checkbox -->
                  <div class="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="tradeable" 
                      name="tradeable" 
                      v-model="tradeable" 
                      :true-value="1"
                      :false-value="0"
                      class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label for="tradeable" class="text-sm text-gray-200 cursor-pointer">
                      Tradeable
                    </label>
                  </div>

                  <!-- Submit Button -->
                  <div class="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      :disabled="loading"
                      class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {{ loading ? 'Adding...' : 'Add Item' }}
                    </button>
                  </div>
                </form>
              </div>
            </transition>

            <!-- Items List -->
            <div class="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <InventoryItem
                v-for="item in filteredItems"
                :key="item.id"
                :itemName="item.name"
                :rarity="item.rarity"
                :category="categoryMap[item.item_category_id]"
                :image="item.image || 'https://placehold.co/128/1a1a1f/666?text=?'"
                :tradeable="item.is_tradeable"
              />
            </div>

            <!-- Empty State -->
            <div v-if="filteredItems.length === 0" class="text-center py-12 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p class="text-sm">{{ searchQuery ? 'No items found' : 'No items yet' }}</p>
            </div>

            <!-- Item Count -->
            <div class="mt-4 text-sm text-gray-400 text-center">
              {{ filteredItems.length }} of {{ items.length }} items
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

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 200ms ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>