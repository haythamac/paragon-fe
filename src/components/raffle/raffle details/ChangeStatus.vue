<script setup>
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { raffleAPI } from '@/services/raffleAPI'

const props = defineProps({
    raffleId: {
        type: Number,
        required: true
    },
    currentStatus: {
        type: String,
        required: true,
        validator: (value) => ['pending', 'ongoing', 'completed'].includes(value)
    }
})

const emit = defineEmits(['statusChanged'])

const loading = ref(false)

const statuses = [
    {
        value: 'pending',
        label: 'Pending',
        color: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
        activeColor: 'bg-gray-600 text-white border-gray-500',
        dotColor: 'bg-gray-400'
    },
    {
        value: 'ongoing',
        label: 'Ongoing',
        color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        activeColor: 'bg-yellow-600 text-white border-yellow-500',
        dotColor: 'bg-yellow-400'
    },
    {
        value: 'completed',
        label: 'Completed',
        color: 'bg-green-500/20 text-green-300 border-green-500/50',
        activeColor: 'bg-green-600 text-white border-green-500',
        dotColor: 'bg-green-400'
    }
]

const currentStatusConfig = computed(() => {
    return statuses.find(s => s.value === props.currentStatus)
})

const changeStatus = async (newStatus) => {
    if (newStatus === props.currentStatus || loading.value) return

    loading.value = true
    try {
        const response = await raffleAPI.changeStatus(props.raffleId, { status: newStatus })

        if (!response) throw new Error('Failed to change status')

        toast.success(`Status changed to ${newStatus}`)
        emit('statusChanged', newStatus)
    } catch (error) {
        console.error('Error changing status:', error)
        toast.error('Failed to change status')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="bg-[#0b0b0d] border border-gray-800 rounded-lg p-4 flex-1">
        <div class="flex items-center justify-between gap-6">
            <!-- Current Status Display -->
            <div>
                <h3 class="text-sm font-medium text-gray-400 mb-2">Current Status</h3>
                <div class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border"
                    :class="currentStatusConfig.color">
                    <div class="w-2 h-2 rounded-full" :class="currentStatusConfig.dotColor"></div>
                    <span class="text-sm font-semibold">{{ currentStatusConfig.label }}</span>
                </div>
            </div>

            <!-- Change Status Buttons -->
            <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-400 mb-2">Change Status</h3>
                <div class="flex gap-2">
                    <button v-for="status in statuses" :key="status.value" @click="changeStatus(status.value)"
                        :disabled="status.value === currentStatus || loading" :class="[
                            'flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                            status.value === currentStatus
                                ? `${status.activeColor} cursor-not-allowed opacity-70`
                                : `${status.color} hover:bg-opacity-30 cursor-pointer`,
                            loading && 'opacity-50 cursor-not-allowed'
                        ]">
                        <span v-if="loading && status.value !== currentStatus"
                            class="flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </span>
                        <span v-else>{{ status.label }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>