import { registerOperator as r, test } from './operator'
import { LogicRule, LogicOperator } from '../model'

function toPrimitive(value: unknown){
  if(typeof value == 'string') return value.trim() == '' ? null : value
  if(typeof value == 'number') return value
  if(typeof value == 'boolean') return String(value)
  return null
}

r({
  value: LogicOperator.AND,
  label: '逻辑与',
  code: '&&',
  description: '所有',
  hasCondition: true,
  test(logic: LogicRule, model: any) {
    const condition = logic.condition
    if (!Array.isArray(condition)) return false

    for (const c of condition) {
      if (!test(c, model)) return false
    }

    return true
  },
})

r({
  value: LogicOperator.OR,
  label: '逻辑或',
  code: '||',
  description: '任一',
  hasCondition: true,
  test(logic: LogicRule, model: any) {
    const condition = logic.condition
    if (!Array.isArray(condition)) return false

    for (const c of condition) {
      if (test(c, model)) return true
    }

    return false
  },
})

r({
  value: LogicOperator.NOT,
  label: '逻辑非',
  code: '!',
  description: '没有',
  hasCondition: true,
  test(logic: LogicRule, model: any) {
    const condition = logic.condition
    if (!Array.isArray(condition)) return false

    for (const c of condition) {
      if (test(c, model)) return false
    }

    return true
  },
})

r({
  value: LogicOperator.LT,
  label: '小于',
  code: '<',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const l = toPrimitive(model[logic.name])
    const r = toPrimitive(logic.value)
    if (l == null || r == null) return false

    return l < r
  },
})

r({
  value: LogicOperator.LTE,
  label: '小于或等于',
  code: '<=',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const l = toPrimitive(model[logic.name])
    const r = toPrimitive(logic.value)
    if (l == null || r == null) return false

    return l <= r
  },
})

r({
  value: LogicOperator.GT,
  label: '大于',
  code: '>',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const l = toPrimitive(model[logic.name])
    const r = toPrimitive(logic.value)
    if (l == null || r == null) return false

    return l > r
  },
})

r({
  value: LogicOperator.GTE,
  label: '大于或等于',
  code: '>=',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const l = toPrimitive(model[logic.name])
    const r = toPrimitive(logic.value)
    if (l == null || r == null) return false

    return l >= r
  },
})

r({
  value: LogicOperator.EQ,
  label: '等于',
  code: '==',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const l = toPrimitive(model[logic.name])
    const r = toPrimitive(logic.value)
    if (l == null || r == null) return false

    return l == r
  },
})

r({
  value: LogicOperator.NE,
  label: '不等于',
  code: '!=',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const l = toPrimitive(model[logic.name])
    const r = toPrimitive(logic.value)
    if (l == null || r == null) return false

    return l != r
  },
})

r({
  value: LogicOperator.EMPTY,
  label: '为空',
  code: 'empty',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const value = model[logic.name]
    if (value == null) return true
    if (Array.isArray(value)) return value.length == 0
    if (typeof value == 'object') return false

    return toPrimitive(value) == null
  },
})

r({
  value: LogicOperator.CONTAINS,
  label: '包含',
  code: 'contains',
  test(logic: LogicRule, model: any) {
    if (null == logic.name) return false

    const value = model[logic.name]
    if (Array.isArray(value)) return value.includes(logic.value)
    if (typeof value == 'string' && typeof logic.value == 'string') {
      if (logic.value.trim() == '') return false
      return value.includes(logic.value)
    }
    return false
  },
})
