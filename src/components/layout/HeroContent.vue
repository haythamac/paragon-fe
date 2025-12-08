<script setup>
const props = defineProps({
  title: { type: String, default: 'Your title' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  align: { type: String, default: 'left' } // 'left' | 'center'
})
</script>

<template>
  <div :class="['space-y-6', align === 'center' ? 'text-center' : 'text-left']">
    <h1 class="text-4xl md:text-5xl font-bold leading-tight text-white">{{ props.title }}</h1>
    <p v-if="props.subtitle" class="text-xl text-gray-300">{{ props.subtitle }}</p>
    <p v-if="props.description" class="text-gray-400 max-w-prose">{{ props.description }}</p>

    <div class="flex flex-wrap gap-3 justify-start" :class="align === 'center' ? 'justify-center' : 'justify-start'">
      <slot name="actions">
        <!-- default action if none provided -->
        <a href="#" class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm">Primary</a>
      </slot>
    </div>
  </div>
</template>