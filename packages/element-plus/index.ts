import './index.scss'

import { FormPreset, useApi } from '@dongls/xform'
import FormSetting from './FormSetting.vue'

import Checkbox from './checkbox'
import Datatable from './datatable'
import Date from './date'
import Divider from './divider'
import Group from './group'
import Number from './number'
import Radio from './radio'
import Select from './select'
import Tabs from './tabs'
import Text from './text'
import Textarea from './textarea'

const ElementPlus: FormPreset = {
  name: 'element-plus',
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

export default ElementPlus