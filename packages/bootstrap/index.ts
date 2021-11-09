import './index.scss'

import { FormPreset } from '@dongls/xform'
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
  slots: {
    'setting_form': FormSetting
  },
  fieldConfs: [
    Text,
    Textarea,
    Number,
    Select,
    Radio,
    Checkbox,
    Date,
    Divider,
    Group,
    Tabs,
    Datatable
  ]
}

export default bootstrap