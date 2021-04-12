import { 
  FormField,
  FormScope,
  LogicOperator,
  LogicRule
} from '../model'

function toPrimitive(value: unknown){
  if(typeof value == 'string') return value.trim() == '' ? null : value
  if(typeof value == 'number') return value
  if(typeof value == 'boolean') return String(value)
  return null
}

const OPERATORS = Object.create(null)

OPERATORS[LogicOperator.LT.value] = function (logic: LogicRule, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l < r
}

OPERATORS[LogicOperator.LTE.value] = function(logic: LogicRule, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l <= r
}

OPERATORS[LogicOperator.GT.value] = function (logic: LogicRule, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l > r
}

OPERATORS[LogicOperator.GTE.value] = function(logic: LogicRule, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l >= r
}

OPERATORS[LogicOperator.EQ.value] = function(logic: LogicRule, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l == r
}

OPERATORS[LogicOperator.NE.value] = function(logic: LogicRule, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l != r
}

OPERATORS[LogicOperator.EMPTY.value] = function(logic: LogicRule, model: any){
  if(null == logic.name) return false

  const value = model[logic.name]
  if(value == null) return true
  if(Array.isArray(value)) return value.length == 0
  if(typeof value == 'object') return false

  return toPrimitive(value) == null
}

OPERATORS[LogicOperator.AND.value] = function(logic: LogicRule, model: any){
  const condition = logic.condition
  if(!Array.isArray(condition)) return false

  for(const c of condition){
    if(!test(c, model)) return false
  }

  return true
}

OPERATORS[LogicOperator.OR.value] = function(logic: LogicRule, model: any){
  const condition = logic.condition
  if(!Array.isArray(condition)) return false

  for(const c of condition){
    if(test(c, model)) return true
  }

  return false
}

OPERATORS[LogicOperator.NOT.value] = function(logic: LogicRule, model: any){
  const condition = logic.condition
  if(!Array.isArray(condition)) return false

  for(const c of condition){
    if(test(c, model)) return false
  }

  return true
}

OPERATORS[LogicOperator.CONTAINS.value] = function(logic: LogicRule, model: any){
  if(null == logic.name) return false

  const value = model[logic.name]
  if(Array.isArray(value)) return value.includes(logic.value)
  if(typeof value == 'string' && typeof logic.value == 'string') {
    if(logic.value.trim() == '') return false
    return value.includes(logic.value)
  }
  return false
}

export function getOperator(operator: string): Readonly<{ value: string, text: string, code: string, description?: string }>{
  const key = operator.toUpperCase()
  return (LogicOperator as any)[key]
}

export function checkCondition(operator: string){
  return operator == LogicOperator.AND.value || operator == LogicOperator.OR.value || operator == LogicOperator.NOT.value
}

export function test(logic: LogicRule, model: any){
  if(logic == null || model == null || typeof model != 'object') return false

  const operator = OPERATORS[logic.operator]
  return typeof operator == 'function' ? operator(logic, model) : false
}

function cleanRule(logic: LogicRule, target: FormField, acc: string[], scope: FormField | LogicRule){
  if(!checkCondition(logic.operator)){
    if(logic.name == target.name){
      if(scope instanceof FormField){
        scope.logic = null
      } else {
        const index = scope.condition.indexOf(logic)
        scope.condition.splice(index, 1)
      }
      
      const data = JSON.parse(JSON.stringify(logic))
      data.label = target.title
      acc.push(data)
    }

    return
  }

  const condition = logic.condition
  if(!Array.isArray(condition) || condition.length == 0) return

  condition.forEach(r => cleanRule(r, target, acc, logic))
}

export function clean(scope: FormScope, field: FormField): string[]{
  if(field.logic == null) return []

  const current = scope.indexOf(field)
  return scope.fields.reduce((acc, f: FormField, index: number) => {
    if(current > index || field == f || field.logic == null) return acc
    cleanRule(field.logic, f, acc, field)
    return acc
  }, [])
}

export function useLogic(){
  return { test, clean }
}