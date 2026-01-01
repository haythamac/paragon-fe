<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

function onChange(e) {
  const val = e.target.value
  emit('update:modelValue', val)
}
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-300 mb-1">{{ label }}</label>
    <select
      :name="name"
      :required="required"
      :value="modelValue"
      @change="onChange"
      class="block w-full rounded-md bg-gray-900 text-white border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option v-if="placeholder" disabled value="" class="text-gray-400">{{ placeholder }}</option>
      <option 
        v-for="(opt, i) in options" 
        :key="i" 
        :value="opt.value"
        :class="opt.color || ''"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
/* Rarity colors */
.rarity-common { color: white; }
.rarity-uncommon { color: #22c55e; } /* green */
.rarity-rare { color: #3b82f6; } /* blue */
.rarity-epic { color: #ef4444; } /* red */
.rarity-legendary { color: #eab308; } /* yellow */
</style>