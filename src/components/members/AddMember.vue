<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'
import FieldInput from '../common/FieldInput.vue'
import Dropdown from '../common/Dropdown.vue'
import { toast } from 'vue-sonner'

import { useFormSubmit } from '@/composables/useFormSubmit';

import { memberAPI } from '@/services/memberAPI.js';

const { submit, isLoading, errors } = useFormSubmit(memberAPI.store);

const playerName = ref('')
const level = ref('')
const power = ref('')
const playerClass = ref('') // keep value after submit
const role = ref('')        // keep value after submit


async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
        name: playerName.value,
        level: level.value,
        power: power.value,
        class: playerClass.value,
        role: role.value
    }

    try {
        await submit(payload)

        // reset only specific fields
        playerName.value = ''
        level.value = ''
        power.value = ''
        // class and role remain unchanged
    } catch (err) {
        console.error("Failed to add member:", err)
    }
}


const loading = ref(false)

onMounted(async () => {
    // 
})


const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)
</script>

<template>
    <div>

        <teleport to="body">
            <transition name="fade">
                <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                    aria-hidden="false">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="close"></div>

                    <div role="dialog" aria-modal="true"
                        class="relative z-10 w-full max-w-md bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                        aria-labelledby="dialog-title">
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">Add member</h2>
                        <p class="text-sm text-gray-400 mb-4">Fill in the item details.</p>

                        <form @submit="handleSubmit" class="space-y-4">

                            <field-input v-model="playerName" label="Player name" name="playerName" type="text"
                                placeholder="Exact in-game name" required>
                            </field-input>
                            <span v-if="errors.name" class="text-red-500 text-sm">
                                {{ errors.name[0] }}
                            </span>

                            <field-input v-model="level" label="Level" name="level" type="number" placeholder="Current level" min="1"
                                hideSpinner required>
                            </field-input>

                            <field-input v-model="power" label="Power" name="power" type="number" placeholder="Growth Power" min="1"
                                hideSpinner required>
                            </field-input>


                            <Dropdown v-model="playerClass" label="Class" name="class" :options="[
                                { label: 'Berserker', value: 'berserker', color: 'rarity-legendary' },
                                { label: 'Warlord', value: 'warlord', color: 'rarity-epic' },
                                { label: 'Skald', value: 'skald', color: 'rarity-rare' },
                                { label: 'Volva', value: 'volva', color: 'rarity-uncommon' },
                                { label: 'Archer', value: 'archer', color: 'rarity-common' },
                            ]" placeholder="Select player class" required />

                            <Dropdown v-model="role" label="Role" name="role" :options="[
                                { label: 'Leader', value: 'leader', color: 'rarity-legendary' },
                                { label: 'Elder', value: 'elder', color: 'rarity-epic' },
                                { label: 'Agent', value: 'agent', color: 'rarity-rare' },
                                { label: 'Member', value: 'member', color: 'rarity-uncommon' },
                                { label: 'New Member', value: 'new-member', color: 'rarity-common' },
                                { label: 'Outcast', value: 'outcast', color: 'rarity-common' },
                            ]" placeholder="Select player role" required />

                            <div class="flex justify-end gap-2 pt-2">
                                <button type="button" :disabled="isLoading"
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
