<script setup>

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    class: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="relative bg-gray-900 border border-gray-700 rounded-lg p-2 hover:bg-gray-700 transition-colors duration-200">
        <!-- Edit button - top right corner -->
        <button class="absolute top-2 right-2 ...">
            <!-- What icon? Pencil? -->
        </button>
        
        <!-- Main content - flex layout -->
        <div class="flex items-center gap-2 p-1">
            <!-- Left side: Class icon/badge -->
            <div class="border border-gray-600 rounded-lg p-4 flex items-center justify-center text-gray-400">
                <!-- How do you display the class? 
                     For now, maybe just show the class name or first letter? -->
                {{class}}
            </div>
            
            <!-- Right side: Member info -->
            <div class="flex-1">
                <!-- Name -->
                <h4 class="text-white font-semibold">{{ name }}</h4>
                
                <!-- Stats row -->
                <div class="flex items-center gap-4 text-sm text-gray-400">
                    <!-- Level -->
                    <span>Lv. {{ level }}</span>
                    
                    <!-- Power -->
                    <span class="text-yellow-500">⚔️ {{ power }}</span>
                </div>
            </div>
        </div>
    </div>
</template>