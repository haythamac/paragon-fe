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
  }
  ,
  tradeable: {
    type: Boolean,
    default: true
  }
})

const rarityColors = {
  common: 'border-gray-500',
  uncommon: 'border-green-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500'
}
</script>

<template>
  <div class="flex items-center bg-[#18181f] border-b border-gray-800 px-3 py-2 hover:bg-[#23232b] transition-all">
    <!-- Image (small, left) -->
    <div class="w-10 h-10 flex-shrink-0 rounded bg-gray-900 flex items-center justify-center overflow-hidden mr-3">
      <img v-if="image" :src="image" :alt="itemName" class="w-full h-full object-contain" />
      <span v-else class="text-xl text-gray-600">?</span>
    </div>

    <!-- Main Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <span class="text-xs font-semibold uppercase px-1.5 py-0.5 rounded"
          :class="{
            'bg-gray-600 text-white': rarity === 'common',
            'bg-green-600 text-white': rarity === 'uncommon',
            'bg-blue-600 text-white': rarity === 'rare',
            'bg-purple-600 text-white': rarity === 'epic',
            'bg-yellow-600 text-gray-900': rarity === 'legendary'
          }">
          {{ rarity }}
        </span>
        <span v-if="tradeable" class="italic text-xs text-gray-400 font-light">[Tradeable]</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-white font-medium text-sm truncate">{{ itemName }}</span>
        <span v-if="category" class="text-xs text-gray-400 truncate">({{ category }})</span>
      </div>
    </div>
  </div>
</template>