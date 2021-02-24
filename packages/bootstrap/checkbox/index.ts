import { XFieldConf, XField, XFormModel } from '@dongls/xform'
import icon from '@common/svg/checkbox.svg'

import checkbox from './checkbox.vue'
import setting from './setting.vue'

export default XFieldConf.create({
  icon: icon,
  type: 'checkbox',
  title: '多选',
  setting: setting,
  build: checkbox,
  validator(field: XField, model: XFormModel){
    const value = model[field.name]
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  },
  onCreate(field, params, init){
    const options = Array.isArray(params.options) ? params.options : []
    if(init) options.push({ value: '选项1' })

    field.options = options
  }
})