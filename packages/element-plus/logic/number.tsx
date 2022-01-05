import classes from './index.module.scss'

import { Field, FormFieldLogic, isEmpty } from '@dongls/xform'
import { Operators as O } from '@common/operator'
import { createWarnTip } from './common'

interface NumberLogic extends FormFieldLogic {
  operator?: string
}

export const NUMBER_VALUE_COMPARE = Field.createFieldLogic({
  type: 'number_value_compare',
  title: '值',
  render(logic: NumberLogic, field){
    const targetField = field.previous().find(f => f.name == logic.field)
    if(targetField == null) return createWarnTip(logic, field)

    const options = [
      O.OPERATOR_EQ,
      O.OPERATOR_NE,
      O.OPERATOR_LT,
      O.OPERATOR_LTE,
      O.OPERATOR_GT,
      O.OPERATOR_GTE
    ].map(o => <el-option value={o.type} label={o.title}/>)

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
        <span>的值</span>
        {operator}
        {value}
      </div>
    )
  },
  test(logic: NumberLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true

    const value = target.value
    if(typeof value != 'number') return false

    return operator.test(value, logic.value)
  },
  validator(logic: NumberLogic){
    if(isEmpty(logic.value)) return '请补全目标值'
    return true
  },
  onCreated(logic: NumberLogic){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_EQ.type
    }
  },
})