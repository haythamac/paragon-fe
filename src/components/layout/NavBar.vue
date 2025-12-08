<script setup>
import { ref } from 'vue'
const mobileOpen = ref(false)
function toggleMenu() { mobileOpen.value = !mobileOpen.value }
</script>

<template>
  <nav class="absolute inset-x-0 top-8 z-40">
    <div class="mx-auto max-w-7xl px-6">
      <div class="bg-[#0b0b0d] border border-gray-700 rounded-xl shadow-md p-3 flex items-center gap-4">
        <div class="font-semibold text-white cursor-pointer">
          <a href="/">Paragon</a>
        </div>

        <ul class="hidden md:flex gap-16 flex-1 justify-center items-center text-sm">
          <li><a class="text-gray-200 hover:text-gray-100" href="#">Games</a></li>
          <li><a class="text-gray-200 hover:text-gray-100" href="#">Members</a></li>

          <li class="relative group">
            <button class="flex items-center gap-2 text-gray-200 hover:text-gray-100 bg-transparent" aria-haspopup="true">
              Events
              <svg class="w-3 h-3 text-gray-300 group-hover:text-gray-100" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>

            <div
              class="absolute left-0 top-full mt-0 w-44 bg-[#0b0b0d] border border-gray-700 rounded-md shadow-lg py-2 z-50
                     opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible
                     hover:opacity-100 hover:visible transition ease-out duration-150 pointer-events-auto">
              <a href="/events/raffle" class="block px-4 py-2 text-gray-200 hover:bg-gray-800">Guild Raffle</a>
            </div>
          </li>

          <li><a class="text-gray-200 hover:text-gray-100" href="#">About</a></li>
        </ul>

        <div class="ml-auto flex items-center gap-3">
          <button class="hidden md:inline-flex bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium">Join Discord</button>
          <button class="md:hidden p-2" @click="toggleMenu" aria-label="Toggle menu">
            <svg class="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile dropdown -->
      <div v-if="mobileOpen" class="mt-2 md:hidden bg-[#0b0b0d] border border-gray-700 rounded-lg shadow-md p-4">
        <ul class="flex flex-col gap-3 text-sm">
          <li><a class="text-gray-200" href="#">Features</a></li>
          <li><a class="text-gray-200" href="#">Pricing</a></li>
          <li><a class="text-gray-200" href="#">Docs</a></li>

          <li>
            <details class="group">
              <summary class="flex justify-between items-center text-gray-200 list-none">Events <span class="text-gray-400">▾</span></summary>
              <ul class="mt-2 pl-4">
                <li><a class="block text-gray-200 py-1" href="/events/raffle">Guild Raffle</a></li>
              </ul>
            </details>
          </li>

          <li><a class="text-gray-200" href="#">Contact</a></li>
          <li><button class="w-full mt-2 bg-indigo-600 text-white px-3 py-2 rounded-md">Join Discord</button></li>
        </ul>
      </div>
    </div>
  </nav>
</template>