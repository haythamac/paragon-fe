<script setup>
const props = defineProps({
    title: String,
    date: String,
    description: String,
    status: String,
    totalParticipants: Number,
    prizeItems: Number,
    legendaryItems: Number,
    totalPrizes: Number,
})

const formattedDate = new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})
</script>

<template>
    <div class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-5">
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
            <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium capitalize" :class="{
                'bg-yellow-700 text-yellow-100': status === 'pending',
                'bg-green-700 text-white': status === 'in-progress',
                'bg-gray-700 text-gray-200': status === 'completed'
            }">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="4" />
                </svg>
                {{ status === 'in-progress' ? 'In Progress' : status }}
            </span>
        </div>

        <!-- Date -->
        <div class="flex items-center gap-2 text-gray-400 mb-3 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formattedDate }}</span>
        </div>

        <!-- Description -->
        <p class="text-gray-300 text-sm mb-5">{{ description }}</p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <!-- Total Participants -->
            <div class="bg-blue-900/30 border border-blue-800/50 rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-400 mb-0.5">{{ totalParticipants }}</div>
                <div class="text-xs text-blue-300">Total Participants</div>
            </div>

            <!-- Prize Items -->
            <div class="bg-purple-900/30 border border-purple-800/50 rounded-lg p-3">
                <div class="text-2xl font-bold text-purple-400 mb-0.5">{{ prizeItems }}</div>
                <div class="text-xs text-purple-300">Prize Items</div>
            </div>

            <!-- Legendary Items -->
            <div class="bg-yellow-900/30 border border-yellow-800/50 rounded-lg p-3">
                <div class="text-2xl font-bold text-yellow-400 mb-0.5">{{ legendaryItems }}</div>
                <div class="text-xs text-yellow-300">Legendary Items</div>
            </div>

            <!-- Total Prizes -->
            <div class="bg-indigo-900/30 border border-indigo-800/50 rounded-lg p-3">
                <div class="text-2xl font-bold text-indigo-400 mb-0.5">{{ totalPrizes }}</div>
                <div class="text-xs text-indigo-300">Total Prizes</div>
            </div>
        </div>
    </div>
</template>