import { Field } from '../../model/Field'
import { registerLogic, test } from './logic'

export const BUILTIN_LOGIC_AND  = Field.createFieldLogic({
  type: 'and',
  title: '逻辑与',
  composed: true,
  test(logic, field) {
    const conditions = logic.conditions
    if(!Array.isArray(conditions)) return false

    for(const c of conditions) {
      if(!test(c, field)) return false
    }

    return true
  },
  render(){
    return <div class="is-logic-legend">如果以下<strong>所有</strong>条件均被满足：</div>
  },
  validator(logic){
    if(!Array.isArray(logic.conditions) || logic.conditions.length <= 0){
      return '至少添加一条子逻辑'
    }
  }
})

export const BUILTIN_LOGIC_OR = Field.createFieldLogic({
  type: 'or',
  title: '逻辑或',
  composed: true,
  test(logic, field) {
    const conditions = logic.conditions
    if(!Array.isArray(conditions)) return false

    for(const c of conditions) {
      if(test(c, field)) return true
    }

    return false
  },
  render(){
    return <div class="is-logic-legend">如果以下<strong>任意</strong>条件被满足：</div>
  },
  validator(logic){
    if(!Array.isArray(logic.conditions) || logic.conditions.length <= 0){
      return '至少添加一条子逻辑'
    }
  }
})

export const BUILTIN_LOGIC_NOT = Field.createFieldLogic({
  type: 'not',
  title: '逻辑非',
  composed: true,
  test(logic, field) {
    const conditions = logic.conditions
    if(!Array.isArray(conditions)) return false

    for(const c of conditions) {
      if(test(c, field)) return false
    }

    return true
  },
  render(){
    return <div class="is-logic-legend">如果以下<strong>所有</strong>条件<strong>均不</strong>被满足：</div>
  },
  validator(logic){
    if(!Array.isArray(logic.conditions) || logic.conditions.length <= 0){
      return '至少添加一条子逻辑'
    }
  }
})

export function useBuiltIn(){
  registerLogic(BUILTIN_LOGIC_AND)
  registerLogic(BUILTIN_LOGIC_OR)
  registerLogic(BUILTIN_LOGIC_NOT)
}