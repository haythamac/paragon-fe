<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  rarity: {
    type: String,
    default: 'common',
    validator: (value) => ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(value)
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:quantity']);

const localQuantity = ref(props.quantity);
const isEditing = ref(false);
const inputValue = ref(props.quantity.toString());
const quantityInput = ref(null);

watch(() => props.quantity, (newVal) => {
  localQuantity.value = newVal;
  inputValue.value = newVal.toString();
});

const increment = () => {
  localQuantity.value++;
  inputValue.value = localQuantity.value.toString();
  emit('update:quantity', localQuantity.value);
};

const decrement = () => {
  if (localQuantity.value > 0) {
    localQuantity.value--;
    inputValue.value = localQuantity.value.toString();
    emit('update:quantity', localQuantity.value);
  }
};

const startEditing = () => {
  isEditing.value = true;
  setTimeout(() => {
    quantityInput.value?.focus();
  }, 0);
};

const handleBlur = () => {
  const numValue = parseInt(inputValue.value) || 0;
  localQuantity.value = numValue;
  inputValue.value = numValue.toString();
  isEditing.value = false;
  emit('update:quantity', localQuantity.value);
};

const handleInput = (e) => {
  const value = e.target.value;
  if (value === '' || /^\d+$/.test(value)) {
    inputValue.value = value;
  } else {
    e.target.value = inputValue.value;
  }
};
</script>

<template>
  <article class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all">
    <div class="flex items-start justify-between gap-4">
      <!-- Left side: Image, Rarity, Name, Description -->
      <div class="flex gap-4 flex-1">
        <!-- Image -->
        <div class="w-20 h-20 bg-gray-900 rounded-lg flex-shrink-0 overflow-hidden">
          <img v-if="image" :src="image" :alt="itemName" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
            <span class="text-2xl">?</span>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Rarity and Item Name -->
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span
              class="text-white text-xs font-semibold px-2 py-1 rounded uppercase"
              :class="{
                'bg-gray-600': rarity === 'common',
                'bg-green-600': rarity === 'uncommon',
                'bg-blue-600': rarity === 'rare',
                'bg-purple-600': rarity === 'epic',
                'bg-orange-600': rarity === 'legendary'
              }"
            >
              {{ rarity }}
            </span>
            <h3 class="text-white font-semibold text-lg truncate">{{ itemName }}</h3>
          </div>

          <!-- Category Badge -->
          <div v-if="category" class="mb-2">
            <span class="text-gray-400 text-xs font-medium px-2 py-1 rounded bg-gray-800 border border-gray-700">
              {{ category }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-gray-400 text-sm leading-relaxed">{{ description }}</p>
        </div>
      </div>

      <!-- Right side: Quantity Controls -->
      <div class="flex items-center gap-2">
        <!-- Quantity Display/Input -->
        <input
          v-if="isEditing"
          ref="quantityInput"
          v-model="inputValue"
          @blur="handleBlur"
          @keydown.enter="handleBlur"
          @input="handleInput"
          type="text"
          class="w-16 h-12 bg-gray-900 text-white text-center text-xl font-semibold rounded border border-gray-700 focus:border-blue-600 focus:outline-none"
        />
        <button
          v-else
          @click="startEditing"
          class="w-16 h-12 bg-gray-900 hover:bg-gray-800 text-white text-xl font-semibold rounded transition-colors cursor-pointer"
        >
          {{ localQuantity }}
        </button>

        <!-- Up/Down Buttons -->
        <div class="flex flex-col gap-1">
          <button
            @click="increment"
            class="w-8 h-8 bg-gray-900 hover:bg-gray-800 rounded flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>

          <button
            @click="decrement"
            :disabled="localQuantity === 0"
            class="w-8 h-8 bg-gray-900 hover:bg-gray-800 rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>