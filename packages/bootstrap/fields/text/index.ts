import { Field, isEmpty } from '@dongls/xform'
import { 
  STRING_VALUE_COMPARE, 
  STRING_LENGTH_COMPARE
} from '@bootstrap/logic'

import icon from '@common/svg/text.svg'
import text from './text.vue'
import setting from './setting.vue'

export default Field.create({
  icon: icon,
  type: 'text',
  title: '单行文本',
  setting: setting,
  build: text,
  validator(field, value){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    return Promise.resolve()
  },
  logic: [
    STRING_VALUE_COMPARE,
    STRING_LENGTH_COMPARE
  ]
})