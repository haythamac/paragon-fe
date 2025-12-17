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
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="(opt, i) in options" :key="i" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<style scoped>
</style>