<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'
import FieldInput from '../common/FieldInput.vue'
import Dropdown from '../common/Dropdown.vue'
import { toast } from 'vue-sonner'

import { categoryAPI } from '@/services/categoryAPI'
import { itemAPI } from '@/services/itemAPI'
import InventoryItem from './InventoryItem.vue'

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

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedRarity = ref('')
const selectedCategory = ref('')
const internalOpen = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)

const open = computed({
  get() {
    return isControlled.value ? !!props.modelValue : internalOpen.value
  },
  set(v) {
    if (isControlled.value) {
      emit('update:modelValue', v)
    } else {
      internalOpen.value = v
    }
  },
})

function close() {
  open.value = false
}

async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    console.log(formData);
    await itemAPI.store(formData);
    toast.success("Item saved successfully");
    form.reset();
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


const slots = useSlots()
</script>

<template>
    <div> 


        <button v-if="!isControlled" type="button"
            class="px-3 py-2 rounded-md border border-gray-700 text-sm bg-gray-800 text-white hover:bg-gray-700"
            @click="open = true">
            Add Item
        </button>

        <teleport to="body">
            <transition name="fade">
                <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden="false">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="close"></div>

                    <div role="dialog" aria-modal="true"
                        class="relative z-10 w-full max-w-4xl bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                        aria-labelledby="dialog-title">
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">Inventory</h2>
                        <p class="text-sm text-gray-400 mb-4">All items are listed here.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                          
                          <InventoryItem
                          itemName="Epic Sword of Testing"
                          description="A powerful sword used for testing purposes."
                          rarity="epic"
                          category="Weapon"
                          :quantity="3"
                          image="https://placehold.co/150"/>

                          <InventoryItem
                          itemName="Epic Sword of Testing"
                          description="A powerful sword used for testing purposes."
                          rarity="epic"
                          category="Weapon"
                          :quantity="3"
                          image="https://placehold.co/150"/>

                          <InventoryItem
                          itemName="Epic Sword of Testing"
                          description="A powerful sword used for testing purposes."
                          rarity="epic"
                          category="Weapon"
                          :quantity="3"
                          image="https://placehold.co/150"/>
                          
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
