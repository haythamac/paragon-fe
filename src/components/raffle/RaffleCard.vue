<script setup>
import { computed } from 'vue'
const props = defineProps({
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
        <div class="text-sm text-gray-300 mt-2">Joined: {{ joined }}</div>
        <div class="text-sm text-gray-300 mt-2">Total Items: {{ items }}</div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div>
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium"
          :class="{
            'bg-yellow-700 text-yellow-100': status === 'pending',
            'bg-green-700 text-white': status === 'in-progress',
            'bg-gray-700 text-gray-200': status === 'completed'
          }"
        >
          {{ status }}
        </span>
      </div>

      <div>
        <a
          v-if="status === 'in-progress'"
          class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm"
          href="#"
        >
          Watch now
        </a>

        <a
          v-else-if="status === 'completed'"
          class="border border-gray-600 text-gray-200 px-3 py-2 rounded-md text-sm"
          href="#"
        >
          View result
        </a>

        <a
          v-else
          class="border border-gray-700 text-gray-200 px-3 py-2 rounded-md text-sm"
          href="#"
        >
          Details
        </a>
      </div>
    </div>
  </article>
</template>