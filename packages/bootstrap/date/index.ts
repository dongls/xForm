import { XFieldConf, XField } from '@dongls/xform'
import icon from '@common/svg/date.svg'

import date from './date.vue'
import setting from './setting.vue'

export default XFieldConf.create({
  icon: icon,
  type: 'date',
  title: '日期',
  setting: setting,
  build: date,
  validator(field: XField, value: string){
    const isEmpty = null == value || typeof value == 'string' && value.length == 0
    if(field.required && isEmpty) return Promise.reject('必填')
    return Promise.resolve()
  }
})