import { FieldConf, isEmpty } from '@dongls/xform'
import icon from '@common/svg/text.svg'

import text from './text.vue'
import setting from './setting.vue'

export default FieldConf.create({
  icon: icon,
  type: 'text',
  title: '单行文本',
  setting: setting,
  build: text,
  validator(field, value){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    return Promise.resolve()
  }
})