import '../packages/core/index.css'
import { createApp } from 'vue'

import XForm from '@dongls/xform'
// import * as XForm from '@dongls/xform'
// console.log(XForm)
import App from './app.vue'
import router from './router'
import component from './component/index'

const app = createApp(App)

app.use(router)
app.use(XForm)
app.use(component)
app.mount('#app')

app.config.performance = __IS_DEV__
app.config.globalProperties.IS_DEV = __IS_DEV__
