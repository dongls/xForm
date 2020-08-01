import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { website } from '@config'

import Designer from './views/designer.vue'
import Builder from './views/builder.vue'
import Viewer from './views/viewer.vue'

const router = createRouter({
  history: createWebHistory(website.base),
  routes: [
    { path: '/', redirect: '/example/designer' },
    { path: '/example/designer', component: Designer },
    { path: '/example/builder', component: Builder },
    { path: '/example/viewer', component: Viewer }
  ] as RouteRecordRaw[]
})

export default router