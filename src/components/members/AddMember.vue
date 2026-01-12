<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'
import FieldInput from '../common/FieldInput.vue'
import Dropdown from '../common/Dropdown.vue'
import { toast } from 'vue-sonner'

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
                <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden="false">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="close"></div>

                    <div role="dialog" aria-modal="true"
                        class="relative z-10 w-full max-w-md bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                        aria-labelledby="dialog-title">
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">Add member</h2>
                        <p class="text-sm text-gray-400 mb-4">Fill in the item details.</p>

                        <form @submit="handleSubmit" class="space-y-4">

                            <field-input label="Player name" name="playerName" type="text" placeholder="Exact in-game name"
                                required>
                            </field-input>

                            <field-input label="Level" name="level" type="number" placeholder="Current level"
                                required>
                            </field-input>

                            <field-input label="Power" name="power" type="number" placeholder="Growth Power"
                                required>
                            </field-input>

                            <field-input label="Class" name="class" type="text" placeholder="Character class"
                                required>
                            </field-input>

                            <Dropdown label="Role" name="role" v-model="selectedRarity" :options="[
                                { label: 'Leader', value: 'leader', color: 'rarity-legendary' },
                                { label: 'Elder', value: 'elder', color: 'rarity-epic' },
                                { label: 'Agent', value: 'agent', color: 'rarity-rare' },
                                { label: 'Member', value: 'member', color: 'rarity-uncommon' },
                                { label: 'New Member', value: 'new-member', color: 'rarity-common' },
                                { label: 'Outcast', value: 'outcast', color: 'rarity-common' },
                            ]" placeholder="Select player role" required />

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
