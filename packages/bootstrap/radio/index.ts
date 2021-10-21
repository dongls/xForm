import { FieldConf, isEmpty, useConstant } from '@dongls/xform'
import icon from '@common/svg/radio.svg'

import radio from './radio.vue'
import setting from './setting.vue'

const { LogicOperator } = useConstant()

export default FieldConf.create({
  icon: icon,
  type: 'radio',
  title: '单选',
  setting: setting,
  build: radio,
  validator(field, value){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    return Promise.resolve()
  },
  onCreate(field, params, init){
    const options = Array.isArray(params.options) ? params.options : []
    if(init) {
      options.push({ value: '选项1' })
      field.attributes.layout = 'inline'
    }
    
    field.options = options
  },
  operators: [
    LogicOperator.EQ,
    LogicOperator.NE,
    LogicOperator.EMPTY,
    LogicOperator.CONTAINS
  ]
})