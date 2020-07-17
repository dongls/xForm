import Store from '@core/store'

import { 
  isRegExp, 
  isEmptyStr 
} from './lang'

import { 
  XField, 
  FieldAddEventDetail, 
  XFormModel, 
  XFormItemContext
} from '@core/model'

import { 
  ComponentInternalInstance, 
  watch, 
  onMounted, 
  onBeforeUnmount 
} from 'vue'

import { 
  XFormItemProps, 
} from '@core/component/XFormItem/component'

import {
  EVENT_XFORM_FIELD_ADD, 
  EVENT_XFORM_VALIDATE
} from '@core/util/event'

import { findComponentElement } from './component'

function parseError(error: any){
  if(null == error) return null
  if(error instanceof Error) return error.message

  return error
}

export function genValidator(field: XField, model: XFormModel, external: Boolean | Function, context: XFormItemContext){
  const validator = function(){
    const findConf = field.findFieldConf()
    const value = model[field.name]
    
    // 如果有外部传入的自定义验证器
    if(typeof external == 'function') {
      const promise = external(field, value, model, context)
      if(!(promise instanceof Promise)) throw new Error('validator必须返回Promise对象')
      return promise
    }

    // 如果是是自定义验证器
    const validator = findConf.validator
    if(typeof validator == 'function') {
      const promise = validator(field, value, model, context)
      if(!(promise instanceof Promise)) throw new Error('validator必须返回Promise对象')
      return promise
    }

    return Promise.resolve()
    // return validateRules(validator, field, value);
  }

  return function(){
    return validator().then(() => {
      context.message.value = null
      return true
    }).catch((error: any) => {
      const message = parseError(error)
      context.message.value = message
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
  if(field.required !== true && isEmptyStr(value)) return null

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

export function useValidator(instance: ComponentInternalInstance, model: XFormModel, props: XFormItemProps, context: XFormItemContext){
  const config = Store.getConfig()
  const immediate = config.validator.immediate
  const field = props.field
  const validator = genValidator(field, model, props.validation, context)

  function fieldAddHandle(event: CustomEvent){
    const detail = event.detail as FieldAddEventDetail
    detail.validator = validator

    // 启用实时验证
    if(immediate) watch(() => model[field.name], validator, { deep: true })
  }

  function fieldValidateHandle(event: CustomEvent){
    event.stopPropagation()
    typeof context.validator == 'function' && context.validator()
  }

  onMounted(() => {
    const element = findComponentElement(instance)

    element.addEventListener(EVENT_XFORM_FIELD_ADD, fieldAddHandle)
    element.addEventListener(EVENT_XFORM_VALIDATE, fieldValidateHandle)
  })

  onBeforeUnmount(() => {
    const element = findComponentElement(instance)

    element.removeEventListener(EVENT_XFORM_FIELD_ADD, fieldAddHandle)
    element.removeEventListener(EVENT_XFORM_VALIDATE, fieldValidateHandle)
  })

  return validator
}