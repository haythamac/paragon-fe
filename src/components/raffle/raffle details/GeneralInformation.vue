<script setup>
const props = defineProps({
    title: String,
    date: String,
    description: String,
    status: String,
    totalParticipants: Number,
    prizeItems: Number,
    coreItems: Number,
    totalPrizes: Number,
})

const formattedDate = new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})
</script>

<template>
    <div class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-8">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
            <h1 class="text-3xl font-bold text-white">{{ title }}</h1>
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium capitalize" :class="{
                'bg-yellow-700 text-yellow-100': status === 'pending',
                'bg-green-700 text-white': status === 'in-progress',
                'bg-gray-700 text-gray-200': status === 'completed'
            }">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="4" />
                </svg>
                {{ status === 'in-progress' ? 'In Progress' : status }}
            </span>
        </div>

        <!-- Date -->
        <div class="flex items-center gap-2 text-gray-400 mb-6">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formattedDate }}</span>
        </div>

        <!-- Description -->
        <p class="text-gray-300 mb-8">{{ description }}</p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Total Participants -->
            <div class="bg-blue-900/30 border border-blue-800/50 rounded-lg p-6">
                <div class="text-4xl font-bold text-blue-400 mb-1">{{ totalParticipants }}</div>
                <div class="text-sm text-blue-300">Total Participants</div>
            </div>

            <!-- Prize Items -->
            <div class="bg-purple-900/30 border border-purple-800/50 rounded-lg p-6">
                <div class="text-4xl font-bold text-purple-400 mb-1">{{ prizeItems }}</div>
                <div class="text-sm text-purple-300">Prize Items</div>
            </div>

            <!-- Legendary Items -->
            <div class="bg-yellow-900/30 border border-yellow-800/50 rounded-lg p-6">
                <div class="text-4xl font-bold text-yellow-400 mb-1">{{ coreItems }}</div>
                <div class="text-sm text-yellow-300">Core Items</div>
            </div>

            <!-- Total Prizes -->
            <div class="bg-indigo-900/30 border border-indigo-800/50 rounded-lg p-6">
                <div class="text-4xl font-bold text-indigo-400 mb-1">{{ totalPrizes }}</div>
                <div class="text-sm text-indigo-300">Total Prizes</div>
            </div>
        </div>
    </div>
</template>