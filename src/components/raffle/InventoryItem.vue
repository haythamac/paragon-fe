<script setup>
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
  }
});
</script>

<template>
  <article class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-all">
    <div class="flex items-center gap-3">
      <!-- Image -->
      <div class="w-12 h-12 bg-gray-900 rounded-lg flex-shrink-0 overflow-hidden">
        <img v-if="image" :src="image" :alt="itemName" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
          <span class="text-lg">?</span>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Rarity and Item Name -->
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span
            class="text-white text-xs font-semibold px-1.5 py-0.5 rounded uppercase"
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
          <h3 class="text-white font-semibold text-sm truncate">{{ itemName }}</h3>
        </div>

        <!-- Category and Description -->
        <div class="flex items-center gap-2 text-xs text-gray-400">
          <span v-if="category" class="font-medium">{{ category }}</span>
          <span v-if="category && description">•</span>
          <span class="truncate">{{ description }}</span>
        </div>
      </div>
    </div>
  </article>
</template>>