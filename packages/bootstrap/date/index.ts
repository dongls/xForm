import { Field, isEmpty, useConstant } from '@dongls/xform'
import icon from '@common/svg/date.svg'

import date from './date.vue'
import setting from './setting.vue'

const { BuiltInLogicOperator } = useConstant()

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
  operators: [
    BuiltInLogicOperator.LT,
    BuiltInLogicOperator.LTE,
    BuiltInLogicOperator.GT,
    BuiltInLogicOperator.GTE,
    BuiltInLogicOperator.EQ,
    BuiltInLogicOperator.NE,
    BuiltInLogicOperator.EMPTY,
  ]
})