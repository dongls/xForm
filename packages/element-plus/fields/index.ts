import { registerField, removeField } from '@dongls/xform'

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

export function use(){
  registerField(fields)
}

export function remove(){
  fields.forEach(removeField)
}

export default {
  use,
  remove
}