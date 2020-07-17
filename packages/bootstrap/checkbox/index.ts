import { XFieldConf, XField } from '@dongls/xform'
import icon from '@common/svg/checkbox.svg'

import checkbox from './checkbox.vue'
import setting from './setting.vue'

export default new XFieldConf({
  icon: icon,
  type: 'checkbox',
  title: '多选框',
  setting: setting,
  build: checkbox,
  validator(field: XField, value: any){
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  }
})