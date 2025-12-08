<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'solid' }, // 'solid' | 'outline' | 'ghost'
  size: { type: String, default: 'md' },       // 'sm' | 'md' | 'lg'
  href: { type: String, default: '' },         // external link (anchor)
  to: { type: [String, Object], default: null }, // vue-router target (router-link)
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' }    // button type when rendering <button>
})

const classes = computed(() => {
  const base = 'inline-flex items-center gap-2 justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const sizes = {
    sm: 'text-sm px-2.5 py-1.5',
    md: 'text-base px-4 py-2',   /* -> text-base so md matches original feel */
    lg: 'text-lg px-6 py-3'
  }
  const variants = {
    solid: 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500 shadow-sm',
    outline: 'border border-gray-700 text-white hover:bg-white/5 focus:ring-gray-600',
    ghost: 'bg-transparent text-white hover:bg-white/5 focus:ring-white/10'
  }

  return [base, sizes[props.size] || sizes.md, variants[props.variant] || variants.solid].join(' ')
})
</script>

<template>
  <!-- Router link when `to` prop provided -->
  <router-link v-if="to" :to="to" :class="classes" :aria-disabled="disabled">
    <slot />
  </router-link>

  <!-- Anchor when `href` provided -->
  <a v-else-if="href" :href="href" :class="classes" :aria-disabled="disabled" rel="noopener noreferrer">
    <slot />
  </a>

  <!-- Default button -->
  <button v-else :type="type" :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>