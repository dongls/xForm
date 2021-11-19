import './index.scss'

import { FormPreset, useApi } from '@dongls/xform'
import FormSetting from './FormSetting.vue'

import Text from './text'
import Textarea from './textarea'
import Number from './number'
import Select from './select'
import Radio from './radio'
import Checkbox from './checkbox'
import Date from './date'
import Divider from './divider'
import Group from './group'
import Tabs from './tabs'
import Datatable from './datatable'

const bootstrap: FormPreset = {
  name: 'bootstrap',
  version: __VERSION__,
  install(){
    const api = useApi()
    const fields = [
      Checkbox,
      Datatable,
      Date,
      Divider,
      Group,
      Number,
      Radio,
      Select,
      Tabs,
      Text,
      Textarea,
    ]
    
    api.registerSlot('setting_form', FormSetting)
    api.registerField(fields)

    return function(){
      api.removeSlot('setting_form')
      fields.forEach(api.removeField)
    }
  }
}

export default bootstrap