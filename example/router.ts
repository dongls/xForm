import { createRouter, createWebHashHistory } from 'vue-router'
import { example as config } from '@config'

import Designer from './views/designer.vue'
import Builder from './views/builder.vue'
import Viewer from './views/viewer.vue'

const router = createRouter({
  history: createWebHashHistory(config.base),
  routes: [
    { path: '/', redirect: '/designer' },
    { path: '/designer', component: Designer },
    { path: '/builder', component: Builder },
    { path: '/viewer', component: Viewer }
  ]
})

export default router