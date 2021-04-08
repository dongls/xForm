export enum EnumLogicOperate {
  /** `<` 小于 */
  LT = 'lt',
  /** `<=` 小于等于 */
  LTE = 'lte',
  /** `>` 大于 */
  GT = 'gt',
  /** `>=` 大于等于 */
  GTE = 'gte',
  /** `==` 等于 */
  EQ = 'eq',
  /** `!=` 不等于 */
  NE = 'ne',
  /** `empty` 代表空值 */
  EMPTY = 'empty',
  /** `&&` 逻辑与 */
  AND = 'and',
  /** `||` 逻辑或 */
  OR = 'or',
  /** `!` 逻辑非 */
  NOT = 'not'
}

export type Logic = {
  operator: EnumLogicOperate;
  name?: string;
  value?: any;
  condition?: Logic[]
}

function toPrimitive(value: unknown){
  if(typeof value == 'string') return value.trim() == '' ? null : value
  if(typeof value == 'number') return value
  if(typeof value == 'boolean') return String(value)
  return null
}

const OPERATORS = Object.create(null)

OPERATORS[EnumLogicOperate.LT] = function (logic: Logic, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l < r
}

OPERATORS[EnumLogicOperate.LTE] = function(logic: Logic, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l <= r
}

OPERATORS[EnumLogicOperate.GT] = function (logic: Logic, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l > r
}

OPERATORS[EnumLogicOperate.GTE] = function(logic: Logic, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l >= r
}

OPERATORS[EnumLogicOperate.EQ] = function(logic: Logic, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l == r
}

OPERATORS[EnumLogicOperate.NE] = function(logic: Logic, model: any){
  if(null == logic.name) return false

  const l = toPrimitive(model[logic.name])
  const r = toPrimitive(logic.value)
  if(l == null || r == null) return false
  
  return l != r
}

OPERATORS[EnumLogicOperate.EMPTY] = function(logic: Logic, model: any){
  if(null == logic.name) return false

  const value = model[logic.name]
  if(value == null) return true
  if(Array.isArray(value)) return value.length == 0
  if(typeof value == 'object') return false

  return toPrimitive(value) == null
}

OPERATORS[EnumLogicOperate.AND] = function(logic: Logic, model: any){
  const condition = logic.condition
  if(!Array.isArray(condition)) return false

  for(const c of condition){
    if(!test(c, model)) return false
  }

  return true
}

OPERATORS[EnumLogicOperate.OR] = function(logic: Logic, model: any){
  const condition = logic.condition
  if(!Array.isArray(condition)) return false

  for(const c of condition){
    if(test(c, model)) return true
  }

  return false
}

OPERATORS[EnumLogicOperate.NOT] = function(logic: Logic, model: any){
  const condition = logic.condition
  if(!Array.isArray(condition)) return false

  for(const c of condition){
    if(test(c, model)) return false
  }

  return true
}

export function test(logic: Logic, model: any){
  if(logic == null || model == null || typeof model != 'object') return false

  const operator = OPERATORS[logic.operator]
  return typeof operator == 'function' ? operator(logic, model) : false
}

export function useLogic(){
  return test
}