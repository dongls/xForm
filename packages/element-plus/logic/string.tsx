import classes from './index.module.scss'

import { Field, FormFieldLogic, isEmpty } from '@dongls/xform'
import { Operators as O } from '@common/operator'
import { createWarnTip } from './common'

interface StringLogic extends FormFieldLogic {
  operator?: string
}

export const STRING_VALUE_COMPARE = Field.createFieldLogic({
  type: 'string_value_compare',
  title: '值',
  render(logic: StringLogic, field){
    const targetField = field.previousField(logic.field)
    if(targetField == null) return createWarnTip(logic, field)

    const options = [
      O.OPERATOR_EQ,
      O.OPERATOR_NE,
      O.OPERATOR_CONTAINS,
      O.OPERATOR_EMPTY,
    ].map(o => <el-option label={o.title} value={o.type}/>)

    const operator = <el-select v-model={logic.operator}>{options}</el-select>
    const value = (
      logic.operator === O.OPERATOR_EMPTY.type
        ? null
        : <el-input v-model={logic.value} placeholder="目标值"/>
    )

    return (
      <div class={classes.logicForm}>
        <span>如果</span>
        <strong>{targetField ? targetField.title : 'N/A'}</strong>
        <span>的值</span>
        {operator}
        {value}
      </div>
    )
  },
  test(logic: StringLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true
  
    return operator.test(target.value, logic.value)
  },
  validator(logic: StringLogic){
    if(logic.operator == O.OPERATOR_EMPTY.type) return true
    if(isEmpty(logic.value)) return '请补全目标值'
    return true
  },
  onCreated(logic: StringLogic){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_EQ.type
    }
  },
})

export const STRING_LENGTH_COMPARE = Field.createFieldLogic({
  type: 'string_length_compare',
  title: '长度',
  render(logic: StringLogic, field){
    const targetField = field.previousField(logic.field)
    if(targetField == null) return createWarnTip(logic, field)
    
    const options = [
      O.OPERATOR_EQ,
      O.OPERATOR_NE,
      O.OPERATOR_LT,
      O.OPERATOR_LTE,
      O.OPERATOR_GT,
      O.OPERATOR_GTE
    ].map(o => <el-option label={o.title} value={o.type}/>)

    const operator = <el-select v-model={logic.operator}>{options}</el-select>
    const value = (
      logic.operator === O.OPERATOR_EMPTY.type
        ? null
        : <el-input-number v-model={logic.value} placeholder="目标值" controls-position="right" min={0} step-strictly/>
    )

    return (
      <div class={classes.logicForm}>
        <span>如果</span>
        <strong>{targetField ? targetField.title : 'N/A'}</strong>
        <span>的长度</span>
        {operator}
        {value}
      </div>
    )
  },
  test(logic: StringLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true

    const value = target.value
    if(typeof value != 'string') return false

    return operator.test(value.length, logic.value)
  },
  validator(logic: StringLogic){
    if(isEmpty(logic.value)) return '请补全目标值'
    return true
  },
  onCreated(logic: StringLogic){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_EQ.type
    }
  },
})