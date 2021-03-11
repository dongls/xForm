import { XFieldConf, XField } from '@dongls/xform'
import icon from '@common/svg/textarea.svg'

import textarea from './textarea.vue'
import setting from './setting.vue'

export default XFieldConf.create({
  icon: icon,
  type: 'textarea',
  title: '多行文本',
  setting: setting,
  build: textarea,
  validator(field: XField, value: string){
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  }
})