<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'
import FieldInput from '../common/FieldInput.vue'
import ComboBoxInput from '../common/ComboBoxInput.vue'
import { toast } from 'vue-sonner'
import { memberAPI } from '@/services/memberAPI'

const loading = ref(false)
const allMembers = ref([])
const selectedMembers = ref([])
const errors = ref([])
const memberSearch = ref('')

onMounted(async () => {
    loading.value = true
    try {
        const memberResponse = await memberAPI.getAll();
        allMembers.value = memberResponse.data.data;
    } catch (err) {
        errors.value = err
        toast.error('Failed to load members.')
        console.log(err)
    } finally {
        loading.value = false
    }
})

const filteredMembers = computed(() => {
    if (!memberSearch.value) return allMembers.value

    return allMembers.value.filter(member => {
        return member.name.toLowerCase().includes(memberSearch.value.toLowerCase())
    })
})

const selectAll = () => {
    selectedMembers.value = [...allMembers.value]
}

const clearAll = () => {
    selectedMembers.value = []
}

const removeMember = (memberId) => {
  selectedMembers.value = selectedMembers.value.filter(m => m.id !== memberId)
}

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
                        class="relative z-10 w-full max-w-5xl bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800"
                        aria-labelledby="dialog-title">
                        <h2 id="dialog-title" class="text-lg font-semibold text-white">Create Raffle</h2>
                        <p class="text-sm text-gray-400 mb-4">Fill in the item details.</p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left side -->
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <p class="text-sm font-medium text-gray-300">
                                        Players selected: {{ selectedMembers.length }}
                                    </p>
                                    <div class="flex gap-2">
                                        <button type="button" @click="selectAll"
                                            class="text-xs px-2 py-1 rounded bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors">
                                            Select All
                                        </button>
                                        <button type="button" @click="clearAll"
                                            class="text-xs px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors">
                                            Clear All
                                        </button>
                                    </div>
                                </div>

                                <!-- ComboBox Input -->
                                <ComboBoxInput v-model="selectedMembers" :items="allMembers" item-text="name"
                                    item-value="id" placeholder="Search and select players..." />

                                <!-- Selected players table -->
                                <div
                                    class="border border-gray-800 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                                    <table v-if="selectedMembers.length > 0" class="w-full text-sm">
                                        <thead class="bg-gray-900 sticky top-0">
                                            <tr>
                                                <th
                                                    class="px-3 py-2 text-left text-xs font-medium text-gray-400">
                                                    Player</th>
                                                <th
                                                    class="px-3 py-2 text-right text-xs font-medium text-gray-400">
                                                    Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-800">
                                            <tr v-for="member in selectedMembers" :key="member.id"
                                                class="hover:bg-gray-900/50 transition-colors">
                                                <td class="px-3 py-2">
                                                    <div class="flex items-center gap-2">
                                                        <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                                        <span class="text-gray-200">{{ member.name }}</span>
                                                    </div>
                                                </td>
                                                <td class="px-3 py-2 text-right">
                                                    <button type="button" @click="removeMember(member.id)"
                                                        class="text-red-400 hover:text-red-300 transition-colors text-xs">
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Empty state -->
                                    <div v-else class="text-center py-12 text-gray-500">
                                        <svg class="mx-auto h-10 w-10 text-gray-600 mb-3" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p class="text-sm">No players selected</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Right side -->
                            <form @submit="handleSubmit" class="space-y-4">

                                <field-input label="Raffle name" name="raffleName" type="text"
                                    placeholder="What is this raffle for?" required>
                                </field-input>

                                <field-input label="Raffle date" name="raffleDate" type="date" required>
                                </field-input>

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
