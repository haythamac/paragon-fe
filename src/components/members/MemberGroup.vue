<script setup>
import MemberCard from './MemberCard.vue';

const props = defineProps({
    groupName: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['edit', 'delete', 'mark-inactive', 'reactivate'])
</script>

<template>
    <div class="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 class="text-white font-semibold mb-4">
            {{ groupName }} 
            <span v-if="count > 0" class="text-sm text-gray-400">({{ count }})</span>
        </h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <MemberCard 
                v-for="member in members" 
                :key="member.id"
                :id="member.id"
                :name="member.name"
                :level="member.level"
                :power="member.power"
                :class="member.class"
                :status="member.status"
                @edit="$emit('edit', $event)"
                @delete="$emit('delete', $event)"
                @mark-inactive="$emit('mark-inactive', $event)"
                @reactivate="$emit('reactivate', $event)"
            />
        </ul>
    </div>
</template>