import '../packages/core/index.css'

import * as Vue from 'vue'

import xForm from '@dongls/xform'
import App from './app.vue'
import router from './router'
import component from './component/index'

const app = Vue.createApp(App)

app.use(router)
app.use(xForm)
app.use(component)
app.mount('#app')

app.config.performance = __IS_DEV__
app.config.globalProperties.IS_DEV = __IS_DEV__

// 暴露Vue对象给外部引入的库使用
;(window as any).Vue = Vue