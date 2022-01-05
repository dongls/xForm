import classes from './index.module.scss'

import { Field, FormFieldLogic, isEmpty } from '@dongls/xform'
import { Operators as O } from '@common/operator'
import { createWarnTip } from './common'

interface DateLogic extends FormFieldLogic {
  operator?: string
}

export const DATE_VALUE_COMPARE = Field.createFieldLogic({
  type: 'date_value_compare',
  title: '值',
  render(logic: DateLogic, field){
    const targetField = field.previousField(logic.field)
    if(targetField == null) return createWarnTip(logic, field)

    const options = [
      O.OPERATOR_EQ,
      O.OPERATOR_NE,
      O.OPERATOR_LT,
      O.OPERATOR_LTE,
      O.OPERATOR_GT,
      O.OPERATOR_GTE,
      O.OPERATOR_EMPTY
    ].map(o => <option value={o.type}>{o.title}</option>)

    const operator = <select class={`form-control form-control-sm ${classes.logicOperator}`} v-model={logic.operator}>{options}</select>
    const value = (
      logic.operator === O.OPERATOR_EMPTY.type
        ? null
        : <input type='date' class="form-control form-control-sm" v-model={logic.value} placeholder="目标值"/>
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
  test(logic: DateLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true
    
    return operator.test(target.value, logic.value)
  },
  validator(logic: DateLogic){
    if(isEmpty(logic.value)) return '请补全目标值'
    return true
  },
  onCreated(logic: DateLogic){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_EQ.type
    }
  },
})