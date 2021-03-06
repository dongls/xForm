import '../packages/core/index.css'
import * as Vue from 'vue'

import XForm from '@dongls/xform'
// import * as XForm from '@dongls/xform'
// console.log(XForm)
import App from './app.vue'
import router from './router'
import component from './component/index'

const app = Vue.createApp(App)

app.use(router)
app.use(XForm)
app.use(component)
app.mount(document.body)

app.config.performance = __IS_DEV__
app.config.globalProperties.IS_DEV = __IS_DEV__

// 暴露Vue对象给外部引入的库使用
;(window as any).Vue = Vue