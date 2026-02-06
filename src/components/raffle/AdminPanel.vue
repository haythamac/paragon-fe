<script setup>
import { ref } from 'vue'
import AddItem from './AddItem.vue'
import Inventory from './Inventory.vue';
import AddRaffle from './AddRaffle.vue';

const addItemOpen  = ref(false)
const inventoryOpen  = ref(false)
const addRaffleOpen  = ref(false)
</script>

<template>
  <div class="w-full bg-[#0b0b0d] border border-gray-800 rounded-xl p-4 shadow-sm">
    <div class="text-sm font-semibold text-white">Manage raffle</div>
    <div class="text-xs text-gray-400 mt-1">Admins only</div>

    <div class="mt-3 grid   gap-2 grid-cols-2">
      <button @click="addItemOpen = true" class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm">Add Item</button>
      <button @click="inventoryOpen = true" class="flex-1 border border-gray-700 text-gray-200 px-3 py-2 rounded-md text-sm">Inventory</button>
      <button @click="addRaffleOpen = true" class="flex-1 border border-gray-700 text-gray-200 px-3 py-2 rounded-md text-sm">Add Raffle</button>
    </div>

    <AddItem v-model="addItemOpen" />
    <Inventory v-model="inventoryOpen" />
    <AddRaffle v-model="addRaffleOpen" />
  </div>
</template>