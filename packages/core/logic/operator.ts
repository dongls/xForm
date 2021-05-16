import { FormField, LogicRule } from '../model'

interface Operator {
  value: string;
  label: string;
  test: (logic: LogicRule, model: any, field?: FormField) => boolean;
  code?: string;
  description?: string;
  hasCondition?: boolean;
  // TODO: 支持分组
  group?: string;
  order?: number;
}

const operators = new Map<String, Operator>()

export function registerOperator(conf: Operator){
  operators.set(conf.value, conf)
}

export function deleteOperator(operator: string){
  operators.delete(operator)
}

export function resetOperator(){
  operators.clear()
}

export function test(logic: LogicRule, model: any, field?: FormField){
  if(logic == null || model == null || typeof model != 'object') return false

  const operator = operators.get(logic.operator)
  if(null == operator) return false

  return typeof operator.test == 'function' ? operator.test(logic, model, field) : false
}

export function getOperators(keys: string[] | null){
  if(keys == null) return Array.from(operators.values()).sort((a, b) => {
    const ao = a.order ?? 0
    const bo = b.order ?? 0
    return ao - bo
  })

  return keys.map(key => operators.get(key))
}

export function getOperator(operator: string){
  return operators.get(operator)
}