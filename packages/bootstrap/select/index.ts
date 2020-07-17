import { XFieldConf, XField } from '@dongls/xform'
import icon from '@common/svg/select.svg'

import select from './select.vue'
import setting from './setting.vue'

export default new XFieldConf({
  icon: icon,
  type: 'select',
  title: '下拉框',
  setting: setting,
  build: select,
  validator(field: XField, value: any){
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  }
})