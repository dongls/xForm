import './index.scss'

import { FormPreset, registerSlot, removeSlot } from '@dongls/xform'

import logic from './logic'
import fields from './fields'

import FormSetting from './FormSetting.vue'

const bootstrap: FormPreset = {
  name: 'bootstrap',
  version: __VERSION__,
  install(){
    registerSlot('setting_form', FormSetting)

    fields.use()
    logic.use()

    return function(){
      removeSlot('setting_form')

      fields.remove()
      logic.remove()
    }
  }
}

export default bootstrap