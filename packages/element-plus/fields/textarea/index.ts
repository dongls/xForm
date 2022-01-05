import { Field, isEmpty } from '@dongls/xform'
import { STRING_LENGTH_COMPARE, STRING_VALUE_COMPARE } from '@element-plus/logic/string'

import icon from '@common/svg/textarea.svg'
import textarea from './textarea.vue'
import setting from './setting.vue'

export default Field.create({
  icon: icon,
  type: 'textarea',
  title: '多行文本',
  setting: setting,
  build: textarea,
  validator(field, value){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    return Promise.resolve()
  },
  logic: [
    STRING_VALUE_COMPARE,
    STRING_LENGTH_COMPARE
  ]
})