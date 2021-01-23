import '@core/theme/index.css'
import { createApp } from 'vue'

import XForm from '@core/index'
import App from './app.vue'
import Modal from './component/modal.vue'

import router from './router'

const app = createApp(App)

app.use(router)
app.use(XForm)
app.component(Modal.name, Modal)
app.mount('#app')

app.config.performance = __IS_DEV__

// import * as x from '@core/index'
// console.log(x)