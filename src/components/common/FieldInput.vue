<script setup lang="ts">
import { toNumber } from 'lodash-es'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  min: { type: [Number, String], default: undefined },
  max: { type: [Number, String], default: undefined },
})

const emit = defineEmits(['update:modelValue'])

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (props.type === 'number') {
    const n = val === '' ? null : Number(val)
    emit('update:modelValue', n)
  } else {
    emit('update:modelValue', val)
  }
}
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-300 mb-1">{{ label }}</label>
    <input
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="onInput"
      class="block w-full rounded-md bg-gray-900 text-white border border-gray-700 placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</template>

<style scoped>
/* keep small and reusable; rely on Tailwind for theming */
</style>
