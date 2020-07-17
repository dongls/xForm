import { XFieldConf, XField } from '@dongls/xform'
import icon from '@common/svg/radio.svg'

import radio from './radio.vue'
import setting from './setting.vue'

export default new XFieldConf({
  icon: icon,
  type: 'radio',
  title: '单选框',
  setting: setting,
  build: radio,
  validator(field: XField, value: any){
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  }
})