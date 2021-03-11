import { XFieldConf, XField } from '@dongls/xform'
import icon from '@common/svg/text.svg'

import text from './text.vue'
import setting from './setting.vue'

export default XFieldConf.create({
  icon: icon,
  type: 'text',
  title: '单行文本',
  setting: setting,
  build: text,
  validator(field: XField, value: string){
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  }
})