import { toArray } from '@dongls/xform'
import { toPrimitive } from './util'

interface Operator{
  type: string
  title: string,
  test: (value: any, target?: any) => boolean
}

function contains(v: any[], t: any[]){
  for(const i of t){
    if(!v.includes(i)) return false
  }

  return true
}

const OPERATOR_LT: Operator = {
  type: 'lt',
  title: '小于',
  test(value, target){
    const v = toPrimitive(value)
    const t = toPrimitive(target)

    if(v == null || t == null) return false

    return v < t
  }
}

const OPERATOR_LTE: Operator = {
  type: 'lte',
  title: '小于或等于',
  test(value, target){
    const v = toPrimitive(value)
    const t = toPrimitive(target)

    if(v == null || t == null) return false

    return v <= t
  }
}

const OPERATOR_GT: Operator = {
  type: 'gt',
  title: '大于',
  test(value, target){
    const v = toPrimitive(value)
    const t = toPrimitive(target)

    if(v == null || t == null) return false

    return v > t
  }
}

const OPERATOR_GTE: Operator = {
  type: 'gte',
  title: '大于或等于',
  test(value, target){
    const v = toPrimitive(value)
    const t = toPrimitive(target)

    if(v == null || t == null) return false

    return v >= t
  }
}

const OPERATOR_EQ: Operator = {
  type: 'eq',
  title: '等于',
  test(value, target){
    const v = toPrimitive(value)
    const t = toPrimitive(target)

    if(v == null || t == null) return false

    return v == t
  }
}

const OPERATOR_NE: Operator = {
  type: 'ne',
  title: '不等于',
  test(value, target){
    const v = toPrimitive(value)
    const t = toPrimitive(target)

    if(v == null || t == null) return false

    return v != t
  }
}

const OPERATOR_EMPTY: Operator = {
  type: 'empty',
  title: '为空',
  test(value){
    if(value == null) return true
    if(Array.isArray(value)) return value.length == 0
    if(typeof value == 'object') return false

    return toPrimitive(value) == null
  }
}

const OPERATOR_CONTAINS: Operator = {
  type: 'contains',
  title: '包含',
  test(value, target){
    const t = toPrimitive(target)

    if(Array.isArray(value)) return value.includes(t)
    if(typeof value == 'string' && typeof t == 'string') {
      if(t.trim() == '') return false
      return value.includes(t)
    }

    return false
  }
}

const OPERATOR_OPTION_EQ: Operator = {
  type: 'option_eq',
  title: '等于',
  test(value, target){
    if(target == null) return false

    const v = toArray(value)
    const t = Array.isArray(target) ? target : [target]
    return contains(v, t) && contains(t, v)
  }
}

const OPERATOR_OPTION_NE: Operator = {
  type: 'option_ne',
  title: '不等于',
  test(value, target){
    if(target == null) return false

    const v = toArray(value)
    const t = Array.isArray(target) ? target : [target]

    return !contains(v, t) || !contains(t, v)
  }
}

const OPERATOR_OPTION_EMPTY: Operator = {
  type: 'option_empty',
  title: '等于',
  test(value){
    if(!Array.isArray(value)) return true
  
    return value.length == 0
  }
}

const OPERATOR_OPTION_CONTAINS: Operator = {
  type: 'option_contains',
  title: '包含',
  test(value, target){
    if(target == null) return false

    const v = toArray(value)
    const t = Array.isArray(target) ? target : [target]

    return contains(v, t)
  }
}

const o = {
  OPERATOR_CONTAINS,
  OPERATOR_EMPTY,
  OPERATOR_EQ,
  OPERATOR_GT,
  OPERATOR_GTE,
  OPERATOR_LT,
  OPERATOR_LTE,
  OPERATOR_NE,

  OPERATOR_OPTION_EQ,
  OPERATOR_OPTION_NE,
  OPERATOR_OPTION_EMPTY,
  OPERATOR_OPTION_CONTAINS,
}

Reflect.defineProperty(o, 'get', {
  value(this: any, type: string): Operator {
    if(type == 'get' || type == null) return null

    for(const key in this){
      const o = this[key]
      if(o.type == type) return o
    }

    return null
  }
})

export const Operators = o as typeof o & { get: (type: string) => Operator }