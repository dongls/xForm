import { Field, isEmpty } from '@dongls/xform'
import { DATE_VALUE_COMPARE } from '@bootstrap/logic'

import icon from '@common/svg/date.svg'
import date from './date.vue'
import setting from './setting.vue'

export default Field.create({
  icon: icon,
  type: 'date',
  title: '日期',
  setting: setting,
  build: date,
  validator(field, value: string){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    return Promise.resolve()
  },
  logic: [
    DATE_VALUE_COMPARE
  ]
})