<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { defineEmits } from 'vue'
const emit = defineEmits(['close', 'apply'])

const filters = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
]

// week selector logic (week starting Sunday)
function ordinal(n) {
  const s = ["th","st","nd","rd"]
  const v = n % 100
  return n + (s[(v-20)%10] || s[v] || s[0])
}
function formatLong(d) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}, ${d.getFullYear()}`
}
function formatShort(d) {
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${mm}/${dd}/${d.getFullYear()}`
}

const weeks = computed(() => {
  const out = []
  const today = new Date()
  const diffToSunday = today.getDay() // 0..6 where 0 = Sunday
  const sunday = new Date(today)
  sunday.setHours(0,0,0,0)
  sunday.setDate(today.getDate() - diffToSunday)
  // generate recent weeks (current + previous 11)
  for (let i=0; i<12; i++) {
    const w = new Date(sunday)
    w.setDate(sunday.getDate() - i*7)
    const label = `[${ordinal(i+1)} week] ${formatLong(w)} (${formatShort(w)})`
    out.push({ value: w.toISOString().slice(0,10), label })
  }
  return out
})

const selectedWeek = ref(weeks.value.length ? weeks.value[0].value : '')
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const selectedWeekLabel = computed(() => {
  const found = weeks.value.find(w => w.value === selectedWeek.value)
  return found ? found.label : '[select week]'
})

function chooseWeek(value) {
  selectedWeek.value = value
  dropdownOpen.value = false
}

// Sort dropdown state
const selectedSort = ref('newest')
const dropdownOpenSort = ref(false)
const dropdownSortRef = ref(null)
const selectedSortLabel = computed(() => (selectedSort.value === 'newest' ? 'Newest' : 'Oldest'))
function chooseSort(value) {
  selectedSort.value = value
  dropdownOpenSort.value = false
}

function handleWindowClick(e) {
  const inWeek = dropdownRef.value && dropdownRef.value.contains(e.target)
  const inSort = dropdownSortRef.value && dropdownSortRef.value.contains(e.target)
  if (!inWeek) dropdownOpen.value = false
  if (!inSort) dropdownOpenSort.value = false
}

onMounted(() => window.addEventListener('click', handleWindowClick))
onBeforeUnmount(() => window.removeEventListener('click', handleWindowClick))
</script>

<template>
  <div class="w-full bg-[#0b0b0d] border border-gray-800 rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-white">Filters</h3>
      <button class="text-gray-400 md:hidden" @click="$emit('close')">Close</button>
    </div>

    <div class="space-y-3">
      <div class="text-xs text-gray-400">Status</div>
      <div class="flex flex-col gap-2 mt-2">
        <label v-for="f in filters" :key="f.id" class="flex items-center gap-2 text-sm text-gray-200">
          <input type="checkbox" class="accent-indigo-500" />
          <span>{{ f.label }}</span>
        </label>
      </div>
    </div>

    <!-- Week selector -->
    <div class="mt-6">
      <div class="text-xs text-gray-400">Week (select start date)</div>
      <div class="relative mt-2" ref="dropdownRef">
        <button
          type="button"
          @click="dropdownOpen = !dropdownOpen"
          class="w-full flex items-center justify-between bg-transparent border border-gray-700 text-gray-200 px-3 py-2 rounded-md"
        >
          <span class="truncate text-left">{{ selectedWeekLabel }}</span>
          <svg class="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
        </button>

        <ul v-if="dropdownOpen" class="absolute z-50 mt-2 w-full max-h-56 overflow-auto bg-[#0b0b0d] border border-gray-800 rounded-md py-1 shadow-lg">
          <li v-for="w in weeks" :key="w.value">
            <button
              type="button"
              @click="chooseWeek(w.value)"
              :class="[
                'w-full text-left px-3 py-2 text-sm focus:outline-none',
                w.value === selectedWeek ? 'bg-gray-700 text-gray-100' : 'text-gray-200 hover:bg-gray-800 hover:text-gray-100'
              ]"
            >
              {{ w.label }}
            </button>
          </li>
        </ul>
      </div>

      <div class="mt-2 text-xs text-gray-400">Use the selected week to filter raffles that occur that week.</div>
    </div>

    <div class="mt-6">
      <div class="text-xs text-gray-400">Sort</div>
      <div class="relative mt-2" ref="dropdownSortRef">
        <button
          type="button"
          @click="dropdownOpenSort = !dropdownOpenSort"
          class="w-full flex items-center justify-between bg-transparent border border-gray-700 text-gray-200 px-3 py-2 rounded-md"
        >
          <span class="truncate text-left">{{ selectedSortLabel }}</span>
          <svg class="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
        </button>

        <ul v-if="dropdownOpenSort" class="absolute z-50 mt-2 w-full max-h-40 overflow-auto bg-[#0b0b0d] border border-gray-800 rounded-md py-1 shadow-lg">
          <li>
            <button type="button" @click="chooseSort('newest')" :class="['w-full text-left px-3 py-2 text-sm focus:outline-none', selectedSort === 'newest' ? 'bg-gray-700 text-gray-100' : 'text-gray-200 hover:bg-gray-800 hover:text-gray-100']">Newest</button>
          </li>
          <li>
            <button type="button" @click="chooseSort('oldest')" :class="['w-full text-left px-3 py-2 text-sm focus:outline-none', selectedSort === 'oldest' ? 'bg-gray-700 text-gray-100' : 'text-gray-200 hover:bg-gray-800 hover:text-gray-100']">Oldest</button>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-6 flex gap-2">
      <button
        class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md"
        @click="$emit('apply', { week: selectedWeek, sort: selectedSort })"
      >
        Apply
      </button>
      <button
        class="flex-1 border border-gray-700 text-gray-200 px-3 py-2 rounded-md"
        @click="selectedWeek = weeks.length ? weeks[0].value : ''; selectedSort = 'newest'"
      >
        Reset
      </button>
    </div>
  </div>
</template> 