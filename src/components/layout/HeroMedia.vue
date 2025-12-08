<script setup>
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'media' },
  rounded: { type: Boolean, default: true }
})
</script>

<template>
  <div class="flex items-center justify-center">
    <slot>
      <img :src="props.src" :alt="props.alt"
           :class="['w-full h-80 md:h-[420px] object-cover shadow-lg', props.rounded ? 'rounded-2xl' : '']" />
    </slot>
  </div>
</template>