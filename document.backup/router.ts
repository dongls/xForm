import { createRouter, createWebHistory } from 'vue-router'
import { doc as config } from '@config'

import Doc from './view/doc.vue'
import NotFound from './view/not-found.vue'

const router = createRouter({
  history: createWebHistory(config.base),
  routes: [
    { path: '/doc/:doc', component: Doc },
    { path: '/:catchAll(.*)', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.path == '/') return next('/doc/introduction')

  next()
})

export default router