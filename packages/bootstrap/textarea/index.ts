import { Field, isEmpty, useConstant } from '@dongls/xform'
import icon from '@common/svg/textarea.svg'

import textarea from './textarea.vue'
import setting from './setting.vue'

const { BuiltInLogicOperator } = useConstant()

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
  operators: [
    BuiltInLogicOperator.EQ,
    BuiltInLogicOperator.NE,
    BuiltInLogicOperator.EMPTY,
    BuiltInLogicOperator.CONTAINS
  ]
})