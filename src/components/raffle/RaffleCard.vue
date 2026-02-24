<script setup>
import { RouterLink } from 'vue-router'
import { computed, ref } from 'vue'
import RaffleForm from './RaffleForm.vue';

const raffleFormOpen  = ref(false)

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
  <article class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-5 flex items-center justify-between gap-4 shadow-sm relative">
    <!-- Delete and Edit buttons - top right -->
    <div class="absolute top-3 right-3 flex gap-1">
      <button 
        @click="$emit('delete', id)"
        class="p-2 text-red-400 hover:text-white hover:bg-red-700 rounded-md transition-colors"
        aria-label="Delete raffle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button 
        @click="raffleFormOpen = true"
        class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
        aria-label="Edit raffle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
    </div>

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
          'bg-green-700 text-white': status === 'ongoing',
          'bg-gray-700 text-gray-200': status === 'completed'
        }">
          {{ status }}
        </span>
      </div>
      <div>
        <RouterLink v-if="status === 'ongoing'" :to="`/raffles/${id}`"
          class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm">
          Watch now
        </RouterLink>
        <RouterLink v-else-if="status === 'completed'" :to="`/raffles/${id}`"
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

  <RaffleForm 
    v-model="raffleFormOpen" 
    :raffleId="id"
    mode="edit"
    @refresh="$emit('refresh')"
    />
</template>