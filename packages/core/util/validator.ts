import { 
  isRegExp, 
  isEmpty, 
  isFunction,
  checkPromise
} from './lang'

import { 
  XField, 
  XFormModel,
  ValidStatusEnum
} from '@model'

import { ComputedRef } from 'vue'

function parseError(error: any){
  if(null == error) return null
  if(error instanceof Error) return error.message

  return error
}

export function createValidator(
  fieldRef: ComputedRef<XField>,
  validationRef: ComputedRef<boolean | Function>, 
  model: XFormModel
){
  function validator(){
    if(validationRef.value === false) return Promise.resolve()

    if(typeof validationRef.value == 'function'){
      const promise = validationRef.value(fieldRef.value, model)
      return checkPromise(promise)
    }

    const fc = fieldRef.value.conf
    if(fc && isFunction(fc.validator)) {
      const promise = fc.validator(fieldRef.value, model)
      return checkPromise(promise)
    }

    return Promise.resolve()
  }

  return function(){
    return validator().then(() => {
      fieldRef.value.validation.message = null
      fieldRef.value.validation.valid = ValidStatusEnum.SUCCESS
      return true
    }).catch((error: any) => {
      const message = parseError(error)
      fieldRef.value.validation.message = message
      fieldRef.value.validation.valid = ValidStatusEnum.ERROR
      return message
    })
  }
}

/**
 * @deprecated
 * 根据指定的规则验证值
 * 
 * @param {*} rules 
 * @param {*} field 
 * @param {*} value 
 */
export function validateRules(rules: any, field: XField, value: any){
  if(!Array.isArray(rules)) rules = [rules]

  for(let i = 0; i < rules.length; i++){
    const message = validateRule(rules[i], field, value)
    if(null != message) return Promise.reject(message)
  }

  return Promise.resolve()
}

/**
 * @deprecated
 * @param {object}    rule - 规则对象
 * @param {function}  rule.test       [1] 自定义的验证方法，不支持异步 
 * @param {string}    rule.type       [2] 值类型，可选值有[string, number, boolean, array]
 * @param {RegExp}    rule.pattern    [3] 必须满足的正则
 * @param {number}    rule.length     [4] 长度，必须满足指定的长度
 * @param {number}    rule.min        [5] 最小长度
 * @param {number}    rule.max        [5] 最大长度 
 * @param {string}    rule.message    验证的失败的提示信息
 * 
 * @param {*} field 
 * @param {*} value 
 */
export function validateRule(rule: any, field: XField, value: any){
  // 非必填且为空值时不验证
  if(field.required !== true && isEmpty(value)) return null

  if(typeof rule.test == 'function') return rule.test(value, field)

  if(null != rule.type) {
    const typeErr = matchType(rule, value)
    if(null !== typeErr) return rule.message || typeErr
  }

  if(isRegExp(rule.pattern) && !rule.pattern.test(value)){
    return rule.message || '格式有误，请检查'
  }

  const lengthErr = matchLength(rule, value)
  if(null !== lengthErr) return rule.message || lengthErr

  return null
}

/** @deprecated */
function matchType(rule: any, value: any){
  // null, undefined 默认通过任何类型校验
  if(null == value) return null
  
  if(rule.type != typeof value) {
    return '格式有误，请检查'
  }

  return null
}


/** @deprecated */
function matchLength(rule: any, value: any){
  if(rule.length > 0 && value.length != rule.length){
    return `长度需要为${rule.length}个字符`
  }

  if(null == value || value.toString().length == 0 || value.length < rule.min || value.length > rule.max){
    return genEmptyTip(rule)
  }
  
  return null
}

/** @deprecated */
function genEmptyTip(rule: any){
  if(rule.min > 0 && rule.max > 0 && rule.max > rule.min){
    return `长度在${rule.min}~${rule.max}个字符之间`
  }

  if(rule.min > 0){
    return `至少${rule.min}个字符`
  }

  if(rule.max > 0){
    return `最多${rule.max}个字符`
  }

  return '不能为空'
}