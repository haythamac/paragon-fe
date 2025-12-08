<script setup>
import { ref } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import FilterSidebar from '@/components/raffle/FilterSidebar.vue'
import RaffleCard from '@/components/raffle/RaffleCard.vue'
import AdminPanel from '@/components/raffle/AdminPanel.vue'

const showFilters = ref(false)

// example mock data
const raffles = ref([
  { id: 1, title: 'Christmas raffle (by Black)', date: '2025-12-08', joined: 'Members: 35 joined', status: 'in-progress' },
  { id: 2, title: 'Guild Raffle #002', date: '2025-12-05', joined: 'Members: 28 joined', status: 'pending' },
  { id: 3, title: 'Guild Raffle #001', date: '2025-12-01', joined: 'Members: 21 joined', status: 'completed' },
])
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
        <button @click="showFilters = !showFilters" class="bg-transparent border border-gray-700 text-gray-200 px-3 py-1 rounded-md">
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
          <div class="text-sm text-gray-400">Showing {{ raffles.length }} raffles • sorted newest → oldest</div>

          <div class="space-y-4">
            <RaffleCard
              v-for="r in raffles"
              :key="r.id"
              :title="r.title"
              :date="r.date"
              :joined="r.joined"
              :status="r.status"
            />
          </div>
        </div>
      </main>
    </div>
  </section>
</template>