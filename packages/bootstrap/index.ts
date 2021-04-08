import './index.scss'
import { XFormPreset } from '@dongls/xform'

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
import Subform from './subform'

const bootstrap: XFormPreset = {
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
    Subform
  ]
}

export default bootstrap