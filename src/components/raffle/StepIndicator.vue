<script setup>
const props = defineProps({
  steps: {
    type: Array,
    required: true,
    // Expected: [{ label: 'Players', icon: '👥' }, ...]
  },
  currentStep: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <div 
      v-for="(step, index) in steps" 
      :key="index"
      class="flex items-center flex-1"
    >
      <!-- Step Circle -->
      <div class="flex flex-col items-center flex-1">
        <div 
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
            currentStep === index 
              ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/30' 
              : currentStep > index
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-500'
          ]"
        >
          <span v-if="currentStep > index">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span 
          :class="[
            'mt-2 text-xs font-medium',
            currentStep === index ? 'text-indigo-400' : 'text-gray-500'
          ]"
        >
          {{ step.label }}
        </span>
      </div>

      <!-- Connector Line -->
      <div 
        v-if="index < steps.length - 1"
        :class="[
          'h-0.5 flex-1 mx-2 transition-all',
          currentStep > index ? 'bg-green-600' : 'bg-gray-800'
        ]"
      />
    </div>
  </div>
</template>