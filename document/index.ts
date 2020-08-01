import '@core/theme/index.css'
import { createApp } from 'vue'

import XForm from '@core/index'
import Example from './example.vue'
import Modal from './component/modal.vue'

import router from './router'

const app = createApp(Example)

app.use(router)
app.use(XForm)
app.component(Modal.name, Modal)
app.mount('#app')

app.config.performance = __IS_DEV__