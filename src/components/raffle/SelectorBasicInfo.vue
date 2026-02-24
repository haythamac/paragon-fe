<script setup>
import FieldInput from '../common/FieldInput.vue'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    playerCount: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['update:name', 'update:date'])

const updateName = (value) => {
    emit('update:name', value)
}

const updateDate = (value) => {
    emit('update:date', value)
}
</script>

<template>
    <div class="space-y-4 max-w-md mx-auto">
        <field-input 
            label="Raffle name" 
            :modelValue="name" 
            @update:modelValue="updateName"
            name="raffleName" 
            type="text"
            placeholder="What is this raffle for?" 
            required 
        />

        <field-input 
            label="Raffle date" 
            :modelValue="date" 
            @update:modelValue="updateDate"
            name="raffleDate" 
            type="date"
            required 
        />

        <div class="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mt-6">
            <h3 class="text-sm font-medium text-gray-300 mb-2">Summary</h3>
            <div class="space-y-1 text-sm text-gray-400">
                <p>Players: <span class="text-white">{{ playerCount }}</span></p>
                <p v-if="name">Name: <span class="text-white">{{ name }}</span></p>
                <p v-if="date">Date: <span class="text-white">{{ date }}</span></p>
            </div>
        </div>
    </div>
</template>