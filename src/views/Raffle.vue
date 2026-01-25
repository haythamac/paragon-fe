<script setup>
import { onMounted, ref } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import FilterSidebar from '@/components/raffle/FilterSidebar.vue'
import RaffleCard from '@/components/raffle/RaffleCard.vue'
import AdminPanel from '@/components/raffle/AdminPanel.vue'
import InventoryItem from '@/components/raffle/InventoryItem.vue'
import { raffleAPI } from '@/services/raffleAPI'

const showFilters = ref(false)

const allRaffles = ref([])

onMounted(async () => {
  document.title = 'Raffles'

  try {
    const raffleResponse = await raffleAPI.getAll();
    allRaffles.value = raffleResponse.data.data;

  } catch (error) {
    console.error('Error fetching raffles:', error)
  }
})

</script>

<template>
  <section class="min-h-[100vh] bg-[#09040f] text-white pt-20 lg:pt-28">
    <NavBar />

    <div class="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[280px_1fr] gap-8">
      <!-- Left: Filters + Admin (desktop visible, mobile toggleable) -->
      <aside class="hidden lg:block space-y-6">
        <FilterSidebar />
        <AdminPanel />
      </aside>

      <!-- Mobile filter button -->
      <div class="lg:hidden mb-4 flex items-center justify-between gap-3">
        <div class="text-sm text-gray-300">Raffles</div>
        <button @click="showFilters = !showFilters"
          class="bg-transparent border border-gray-700 text-gray-200 px-3 py-1 rounded-md">
          Filters
        </button>
      </div>

      <!-- Mobile: sliding filters panel (contains AdminPanel as well) -->
      <div v-if="showFilters" class="lg:hidden mb-4">
        <div class="space-y-4">
          <FilterSidebar @close="showFilters = false" />
          <AdminPanel />
        </div>
      </div>

      <!-- Right: Main content -->
      <main class="relative">
        <!-- Raffle list -->
        <div class="space-y-6">
          <div class="text-sm text-gray-400">Showing raffles • sorted newest → oldest</div>

          <div class="space-y-4">
            <RaffleCard v-for="r in allRaffles" 
                :key="r.id" 
                :id="r.id"
                :title="r.name" 
                :date="r.date" 
                :joined="r.members_count"
                :items="r.items_count" 
                :status="r.status" />
          </div>

          <div class="space-y-4">
            <InventoryItem itemName="Epic Sword of Testing" description="A powerful sword used for testing purposes."
              rarity="epic" :quantity="3" image="https://via.placeholder.com/150" />
          </div>
        </div>
      </main>
    </div>
  </section>
</template>