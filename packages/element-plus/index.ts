import './index.scss'

import { FormPreset } from '@dongls/xform'
import FormSetting from './FormSetting.vue'

import Checkbox from './checkbox'
import Date from './date'
import Divider from './divider'
import Number from './number'
import Radio from './radio'
import Select from './select'
import Text from './text'
import Textare from './textarea'

const ElementPlus: FormPreset = {
  name: 'element-plus',
  version: __VERSION__,
  slots: {
    'setting_form': FormSetting
  },
  fieldConfs: [
    Checkbox,
    Date,
    Divider,
    Number,
    Radio,
    Select,
    Text,
    Textare,
  ]
}

export default ElementPlus