<script setup>
import { ref } from 'vue'
import ItemsManagement from './ItemsManagement.vue'
import RaffleForm from './RaffleForm.vue';

const itemsManagementOpen = ref(false)
const raffleFormOpen = ref(false)

const emit = defineEmits(['refresh'])
</script>

<template>
  <div class="w-full bg-[#0b0b0d] border border-gray-800 rounded-xl p-4 shadow-sm">
    <div class="text-sm font-semibold text-white">Manage raffle</div>
    <div class="text-xs text-gray-400 mt-1">Admins only</div>

    <div class="mt-3 grid   gap-2 grid-cols-2">
      <button @click="itemsManagementOpen = true"
        class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors">
        Manage Items
      </button>
      <button @click="raffleFormOpen = true"
        class="flex-1 border border-gray-700 text-gray-200 px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">Add Raffle
      </button>
    </div>

    <ItemsManagement v-model="itemsManagementOpen" @refresh="$emit('refresh')" />
    <RaffleForm v-model="raffleFormOpen" mode="add" @refresh="$emit('refresh')" />
  </div>
</template>