import { FieldConf, isEmpty, useConstant } from '@dongls/xform'
import icon from '@common/svg/textarea.svg'

import textarea from './textarea.vue'
import setting from './setting.vue'

const { LogicOperator } = useConstant()

export default FieldConf.create({
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
    LogicOperator.EQ,
    LogicOperator.NE,
    LogicOperator.EMPTY,
    LogicOperator.CONTAINS
  ]
})