import { createRouter, createWebHistory } from 'vue-router'
import { website } from '@config'

import Example from './views/example/main.vue'
import Designer from './views/example/designer.vue'
import Builder from './views/example/builder.vue'
import Viewer from './views/example/viewer.vue'

import { Doc, Page } from './views/document'
import NotFound from './views/not-found.vue'

const router = createRouter({
  history: createWebHistory(website.base),
  routes: [
    { path: '/', redirect: '/example/designer' },
    {
      path: '/example',
      component: Example,
      children: [
        { path: '', redirect: '/example/designer' },
        { path: 'designer', component: Designer },
        { path: 'builder', component: Builder },
        { path: 'viewer', component: Viewer }
      ]
    },
    {
      path: '/doc', 
      component: Doc,
      children: [
        { path: '', redirect: '/doc/introduction' },
        { path: ':doc', component: Page }
      ]
    },
    { path: '/:catchAll(.*)', component: NotFound }
  ]
})

export default router