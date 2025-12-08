import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/events/raffle',
    name: 'raffle',
    // Lazy loading for better performance
    component: () => import('@/views/Raffle.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router