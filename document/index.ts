import '../packages/core/theme/index.css'
import { createApp } from 'vue'

import XForm from '@dongls/xform'
// import * as XForm from '@dongls/xform'
// console.log(XForm)
import App from './app.vue'
import Modal from './component/modal.vue'

import router from './router'

const app = createApp(App)

app.use(router)
app.use(XForm)
app.component(Modal.name, Modal)
app.mount('#app')

app.config.performance = __IS_DEV__
app.config.globalProperties.IS_DEV = __IS_DEV__
