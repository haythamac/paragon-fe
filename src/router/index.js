import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/members',
    name: 'members',
    // Lazy loading for better performance
    component: () => import('@/views/Members.vue')
  },
  {
    path: '/events/raffle',
    name: 'raffle',
    component: () => import('@/views/Raffle.vue')
  },
  {
    path: '/raffles/:id',
    name: 'raffle-detail',
    component: () => import('@/components/raffle/RaffleDetail.vue')
  },
  {
    path: '/raffles/:id/result',
    name: 'raffle-result',
    component: () => import('@/components/raffle/RaffleResult.vue')
  },
  {
    path: '/test-categories',
    name: 'TestCategories',
    component: () => import('@/views/TestCategories.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router