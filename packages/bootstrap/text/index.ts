import { FieldConf, isEmpty, constant } from '@dongls/xform'
import icon from '@common/svg/text.svg'

import text from './text.vue'
import setting from './setting.vue'

const { LogicOperator } = constant

export default FieldConf.create({
  icon: icon,
  type: 'text',
  title: '单行文本',
  setting: setting,
  build: text,
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