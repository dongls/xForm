import { registerField, removeField } from '@dongls/xform'

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

export const fields = [
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