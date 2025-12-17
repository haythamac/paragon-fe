<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { useSlots } from 'vue'
import FieldInput from '../common/FieldInput.vue';
import Dropdown from '../common/Dropdown.vue';

const props = defineProps<{ modelValue?: boolean }>()
const emit = defineEmits(['update:modelValue'])

const internalOpen = ref(false)
const isControlled = computed(() => props.modelValue !== undefined)
const open = computed<boolean>({
    get() {
        return isControlled.value ? !!props.modelValue : internalOpen.value
    },
    set(v: boolean) {
        if (isControlled.value) emit('update:modelValue', v)
        else internalOpen.value = v
    },
})

function close() {
    open.value = false
}

function handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form).entries())
    console.log('AddItem submit', data)
    close()
}

const slots = useSlots()
</script>

<template>
    <div>
        <button v-if="!isControlled" type="button"
            class="px-3 py-2 rounded-md border border-gray-700 text-sm bg-gray-800 text-white hover:bg-gray-700"
            @click="open = true">
            Add Item
        </button>

        <teleport to="body">
            <transition name="fade">
                <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden="false">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="close"></div>

                    <div role="dialog" aria-modal="true"
                        class="relative z-10 w-full max-w-md bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                        aria-labelledby="dialog-title">
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">Add Item</h2>
                        <p class="text-sm text-gray-400 mb-4">Fill in the item details.</p>

                        <form @submit="handleSubmit" class="space-y-4">

                            <field-input label="Item Name" name="itemName" type="text" placeholder="Enter item name"
                                required>
                            </field-input>

                            <dropdown> </dropdown>

                            <dropdown label="Rarity" name="rarity" :options="[
                                { label: 'Common', value: 'common' },
                                { label: 'Uncommon', value: 'uncommon' },
                                { label: 'Rare', value: 'rare' },
                                { label: 'Epic', value: 'epic' },
                                { label: 'Legendary', value: 'legendary' },
                            ]" placeholder="Select rarity" required> </dropdown>

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button"
                                    class="px-3 py-2 rounded-md border border-gray-700 text-gray-200 bg-transparent"
                                    @click="close">Cancel</button>
                                <button type="submit"
                                    class="px-4 py-2 rounded-md bg-indigo-600 text-white">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 160ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
