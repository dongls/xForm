import Vue from 'vue';
import VueRouter from 'vue-router';

import Designer from './components/Designer.vue';
import Builder from './components/Builder.vue';
import Viewer from './components/Viewer.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/designer' },
  { path: '/designer', component: Designer },
  { path: '/builder', component: Builder },
  { path: '/viewer', component: Viewer }
]

const router = new VueRouter({
  routes
})

export default router;
