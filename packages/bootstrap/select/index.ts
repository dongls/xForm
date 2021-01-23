import { XFieldConf, XField, XFormModel } from '@dongls/xform'
import icon from '@common/svg/select.svg'

import select from './select.vue'
import setting from './setting.vue'

export default XFieldConf.create({
  icon: icon,
  type: 'select',
  title: '下拉框',
  setting: setting,
  build: select,
  validator(field: XField, model: XFormModel){
    const value = model[field.name]
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  },
  onCreate(field: XField, params: any){
    const options = Array.isArray(params.options) ? params.options : []
    if(options.length == 0) options.push({ value: '选项1' })
    field.options = options

    return field
  }
})