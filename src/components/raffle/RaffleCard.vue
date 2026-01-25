<script setup>
import { RouterLink } from 'vue-router'

import { computed } from 'vue'
const props = defineProps({
  id: [String, Number],
  title: String,
  date: String,
  joined: String,
  items: String,
  status: String, // pending | in-progress | completed
})
const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

</script>

<template>
  <article class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-5 flex items-center justify-between gap-4 shadow-sm">
    <div class="flex gap-4 items-start">
      <div class="flex flex-col">
        <div class="text-xs text-gray-400">{{ formattedDate }}</div>
        <div class="text-lg font-semibold text-white">{{ title }}</div>
        <div class="text-sm text-gray-300 mt-2">Joined Member: {{ joined }}</div>
        <div class="text-sm text-gray-300 mt-2">Total Items: {{ items }}</div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div>
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium" :class="{
          'bg-yellow-700 text-yellow-100': status === 'pending',
          'bg-green-700 text-white': status === 'in-progress',
          'bg-gray-700 text-gray-200': status === 'completed'
        }">
          {{ status }}
        </span>
      </div>

      <div>
        <RouterLink v-if="status === 'in-progress'" :to="`/raffles/${id}`"
          class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm">
          Watch now
        </RouterLink>

        <RouterLink v-else-if="status === 'completed'" :to="`/raffles/${id}/result`"
          class="border border-gray-600 text-gray-200 px-3 py-2 rounded-md text-sm">
          View result
        </RouterLink>

        <RouterLink v-else :to="`/raffles/${id}`"
          class="border border-gray-700 text-gray-200 px-3 py-2 rounded-md text-sm">
          Details
        </RouterLink>
      </div>
    </div>
  </article>
</template>