import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DetailsView from '@/views/DetailsView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/:lang(cs|en)/', name: 'home', component: HomeView },
  { path: '/:lang(cs|en)/details/:id', name: 'details', component: DetailsView },
  { path: '/:pathMatch(.*)*', redirect: '/cs' }, // Default fallback
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
