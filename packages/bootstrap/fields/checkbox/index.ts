import { Field, isEmpty } from '@dongls/xform'
import icon from '@common/svg/checkbox.svg'
import { MULTIPLE_OPTION_VALUE_COMPARE } from '@bootstrap/logic'

import checkbox from './checkbox.vue'
import setting from './setting.vue'

export default Field.create({
  icon: icon,
  type: 'checkbox',
  title: '多选',
  setting: setting,
  build: checkbox,
  validator(field, value: any[]){
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
  logic: [
    MULTIPLE_OPTION_VALUE_COMPARE
  ]
})