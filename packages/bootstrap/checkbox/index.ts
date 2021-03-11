import { XFieldConf, XField } from '@dongls/xform'
import icon from '@common/svg/checkbox.svg'

import checkbox from './checkbox.vue'
import setting from './setting.vue'

export default XFieldConf.create({
  icon: icon,
  type: 'checkbox',
  title: '多选',
  setting: setting,
  build: checkbox,
  validator(field: XField, value: any[]){
    const isEmpty = Array.isArray(value) ? value.length == 0 : true
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  },
  onCreate(field, params, init){
    const options = Array.isArray(params.options) ? params.options : []
    if(init) options.push({ value: '选项1' })

    field.options = options
  }
})