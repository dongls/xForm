import classes from './index.module.scss'

import { Field, FormField, FormFieldLogic, isEmpty } from '@dongls/xform'
import { Operators as O } from '@common/operator'
import { createWarnTip } from './common'

interface OptionLogic extends FormFieldLogic {
  operator?: string
}

function createLogicValue(logic: OptionLogic, target: FormField){
  if(logic.operator == O.OPERATOR_EMPTY.type) return null
  if(logic.operator == O.OPERATOR_CONTAINS.type) {
    return <input type='text' class="form-control form-control-sm" v-model={logic.value} placeholder="目标值"/>
  }

  if(!Array.isArray(target.options)) return null

  const isMultiple = (
    logic.operator == O.OPERATOR_OPTION_EQ.type ||
    logic.operator == O.OPERATOR_OPTION_NE.type || 
    logic.operator == O.OPERATOR_OPTION_CONTAINS.type
  )

  if(isMultiple) {
    const options = target.options.map(option => <el-option value={option.value} label={option.label ?? option.value}/>)
    return <el-select class={classes.valueSelect} v-model={logic.value} multiple collapse-tags clearable>{options}</el-select>
  }

  const options = target.options.map(option => {
    return <el-option value={option.value} label={option.label ?? option.value}/>
  })

  return (
    <el-select class={classes.valueSelect} v-model={logic.value} placeholder="请选择目标值">
      {options}
    </el-select>
  )
}

function isSafeOption(logic: OptionLogic, rootField: FormField){
  if(!(rootField instanceof FormField) || logic.value == null) return false

  const targetField = rootField.previous().find(f => f.name == logic.field)
  if(targetField == null) return false

  const options = targetField.options
  if(!Array.isArray(options) || options.length == 0) return false

  const value = Array.isArray(logic.value) ? logic.value : [logic.value]

  for(const item of value){
    if(options.find(i => i.value === item) == null) return false
  }

  return true
}

export const OPTION_VALUE_COMPARE = Field.createFieldLogic({
  type: 'option_value_compare',
  title: '值',
  render(logic: OptionLogic, field){
    const targetField = field.previousField(logic.field)
    if(targetField == null) return createWarnTip(logic, field)

    const options = [
      O.OPERATOR_EQ,
      O.OPERATOR_NE,
      O.OPERATOR_CONTAINS,
      O.OPERATOR_EMPTY,
    ].map(o => <el-option value={o.type} label={o.title}/>)

    const operator = <el-select v-model={logic.operator}>{options}</el-select>
    const value = createLogicValue(logic, targetField)

    return (
      <div class={classes.logicForm}>
        <span>如果</span>
        <strong>{targetField.title}</strong>
        <span>的值</span>
        {operator}
        {value}
      </div>
    )
  },
  test(logic: OptionLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true

    return operator.test(target.value, logic.value)
  },
  validator(logic: OptionLogic, rootField: FormField){
    if(logic.operator == O.OPERATOR_EMPTY.type) return true
    if(logic.operator == O.OPERATOR_CONTAINS.type){
      return isEmpty(logic.value) ? '请输入目标值' : true
    }

    if(isEmpty(logic.value) || !isSafeOption(logic, rootField)) return '请选择目标值'
    return true
  },
  onCreated(logic: OptionLogic, rootField: FormField){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_EQ.type
    }

    if(logic.operator != O.OPERATOR_CONTAINS.type && !isSafeOption(logic, rootField)){
      logic.value = null
    }
  }
})

export const MULTIPLE_OPTION_VALUE_COMPARE = Field.createFieldLogic({
  type: 'multiple_option_value_compare',
  title: '值',
  render(logic: OptionLogic, field){
    const targetField = field.previousField(logic.field)
    if(targetField == null) return createWarnTip(logic, field)

    const options = [
      O.OPERATOR_OPTION_EQ,
      O.OPERATOR_OPTION_NE,
      O.OPERATOR_OPTION_CONTAINS,
      O.OPERATOR_EMPTY,
    ].map(o => <el-option value={o.type} label={o.title}/>)

    const operator = <el-select v-model={logic.operator}>{options}</el-select>
    const value = createLogicValue(logic, targetField)

    return (
      <div class={classes.logicForm}>
        <span>如果</span>
        <strong>{targetField.title}</strong>
        <span>的值</span>
        {operator}
        {value}
      </div>
    )
  },
  test(logic: OptionLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true

    return operator.test(target.value, logic.value)
  },
  onCreated(logic: OptionLogic, rootField: FormField){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_OPTION_EQ.type
    }

    if(!isSafeOption(logic, rootField)){
      logic.value = null
    }
  }
})