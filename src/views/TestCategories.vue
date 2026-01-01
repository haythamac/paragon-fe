<template>
  <div class="p-10 bg-gray-900 min-h-screen text-white">
    <h1 class="text-2xl mb-4">Category Test</h1>
    
    <button 
      @click="fetchCategories" 
      class="bg-blue-600 px-4 py-2 rounded mb-4"
    >
      Fetch Categories
    </button>

    <div v-if="loading" class="text-yellow-400">Loading...</div>
    
    <div v-if="error" class="text-red-400">
      Error: {{ error }}
    </div>

    <div v-if="categories.length > 0" class="mt-4">
      <h2 class="text-xl mb-2">Categories:</h2>
      <pre class="bg-gray-800 p-4 rounded">{{ categories }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { categoryAPI } from '@/services/categoryAPI'

const categories = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchCategories() {
  loading.value = true
  error.value = null
  categories.value = []
  
  try {
    const response = await categoryAPI.getAll()
    categories.value = response.data
    console.log('Success! Categories:', response.data)
  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}
</script>