import { Field, isEmpty } from '@dongls/xform'
import { OPTION_VALUE_COMPARE } from '@bootstrap/logic'

import icon from '@common/svg/select.svg'
import select from './select.vue'
import setting from './setting.vue'

export default Field.create({
  icon: icon,
  type: 'select',
  title: '下拉选择',
  setting: setting,
  build: select,
  validator(field, value){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    return Promise.resolve()
  },
  onCreate(field, params, init){
    const options = Array.isArray(params.options) ? params.options : []
    if(init) options.push({ value: '选项1' })
    
    field.options = options
  },
  logic: [
    OPTION_VALUE_COMPARE
  ]
})