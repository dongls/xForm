import './index.scss'

import { FormPreset } from '@dongls/xform'

import Date from './date'
import Divider from './divider'
import Number from './number'
import Select from './select'
import Text from './text'
import Textare from './textarea'

const ElementPlus: FormPreset = {
  name: 'element-plus',
  version: __VERSION__,
  fieldConfs: [
    Date,
    Divider,
    Number,
    Select,
    Text,
    Textare,
  ]
}

export default ElementPlus