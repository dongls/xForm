import { Field, isEmpty, useConstant } from '@dongls/xform'

import icon from '@common/svg/number.svg'
import setting from './setting.vue'
import number from './number.vue'

const { BuiltInLogicOperator } = useConstant()

export default Field.create({
  icon,
  type: 'number',
  title: '数字',
  setting,
  build: number,
  validator(field, value: number | string){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    if(field.attributes.integer && !/^[-+]?[1-9]?\d+$/.test(value + '')) return Promise.reject('请输入整数')

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