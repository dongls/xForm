import '@core/theme/index.css'

import { createApp } from 'vue'

import XForm from '@core/index'
import XFormBootstrap from '../packages/bootstrap'
import { XFormOption } from '@core/model'

import Example from './example.vue'
import Modal from './component/modal.vue'

import router from './router'

const app = createApp(Example)

const option = {
  preset: XFormBootstrap,
  config: {
    modes: {
      example: [
        {
          title: '基础字段',
          types: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date']
        },
        {
          title: '辅助字段',
          types: ['divider', 'info']
        }
      ],
      simple: ['text', 'textarea', 'number', 'select']
    }
  }
} as XFormOption

app.use(router)
app.use(XForm, option)
app.component(Modal.name, Modal)
app.mount('#app')