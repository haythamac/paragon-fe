<script setup>
import { ref, watch } from 'vue'
import FieldInput from '../common/FieldInput.vue'
import Dropdown from '../common/Dropdown.vue'
import { toast } from 'vue-sonner'
import { memberAPI } from '@/services/memberAPI.js'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    member: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'refresh'])

const playerName = ref('')
const level = ref('')
const power = ref('')
const playerClass = ref('')
const role = ref('')
const loading = ref(false)

// Populate form when member prop changes
watch(() => props.member, (newMember) => {
    if (newMember) {
        playerName.value = newMember.name || ''
        level.value = newMember.level || ''
        power.value = newMember.power || ''
        playerClass.value = newMember.class || ''
        role.value = newMember.role || ''
    }
}, { immediate: true })

async function handleSubmit(e) {
    e.preventDefault()
    
    if (!props.member || !props.member.id) {
        toast.error('No member selected')
        return
    }

    const payload = {
        name: playerName.value,
        level: level.value,
        power: power.value,
        class: playerClass.value,
        role: role.value
    }

    loading.value = true
    try {
        await memberAPI.update(props.member.id, payload)
        toast.success('Member updated successfully')
        emit('refresh')
        close()
    } catch (err) {
        console.error('Failed to update member:', err)
        
        if (err.response?.status === 422) {
            const errors = err.response.data.errors
            const firstError = Object.values(errors)[0]?.[0]
            toast.error(firstError || 'Validation failed')
        } else {
            toast.error('Failed to update member')
        }
    } finally {
        loading.value = false
    }
}

const close = () => {
    emit('update:modelValue', false)
}
</script>

<template>
    <div>
        <teleport to="body">
            <transition name="fade">
                <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

                    <div role="dialog" aria-modal="true"
                        class="relative z-10 w-full max-w-md bg-[#0b0b0d] text-white rounded-lg shadow-lg p-6 border border-gray-800">
                        <h2 class="text-lg font-semibold text-white">Edit Member</h2>
                        <p class="text-sm text-gray-400 mb-4">Update member details.</p>

                        <form @submit="handleSubmit" class="space-y-4">
                            <field-input 
                                v-model="playerName" 
                                label="Player name" 
                                name="playerName" 
                                type="text"
                                placeholder="Exact in-game name" 
                                required
                            />

                            <field-input 
                                v-model="level" 
                                label="Level" 
                                name="level" 
                                type="number" 
                                placeholder="Current level" 
                                min="1"
                                required
                            />

                            <field-input 
                                v-model="power" 
                                label="Power" 
                                name="power" 
                                type="number" 
                                placeholder="Growth Power" 
                                min="1"
                                required
                            />

                            <Dropdown 
                                v-model="playerClass" 
                                label="Class" 
                                name="class" 
                                :options="[
                                    { label: 'Berserker', value: 'berserker', color: 'rarity-legendary' },
                                    { label: 'Warlord', value: 'warlord', color: 'rarity-epic' },
                                    { label: 'Skald', value: 'skald', color: 'rarity-rare' },
                                    { label: 'Volva', value: 'volva', color: 'rarity-uncommon' },
                                    { label: 'Archer', value: 'archer', color: 'rarity-common' },
                                ]" 
                                placeholder="Select player class" 
                                required 
                            />

                            <Dropdown 
                                v-model="role" 
                                label="Role" 
                                name="role" 
                                :options="[
                                    { label: 'Leader', value: 'leader', color: 'rarity-legendary' },
                                    { label: 'Elder', value: 'elder', color: 'rarity-epic' },
                                    { label: 'Agent', value: 'agent', color: 'rarity-rare' },
                                    { label: 'Member', value: 'member', color: 'rarity-uncommon' },
                                    { label: 'New Member', value: 'new-member', color: 'rarity-common' },
                                ]" 
                                placeholder="Select player role" 
                                required 
                            />

                            <div class="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    :disabled="loading"
                                    class="px-3 py-2 rounded-md border border-gray-700 text-gray-200 bg-transparent hover:bg-gray-800 transition-colors"
                                    @click="close"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    :disabled="loading"
                                    class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {{ loading ? 'Updating...' : 'Update' }}
                                </button>
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