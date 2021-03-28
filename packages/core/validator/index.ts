import { 
  checkPromise,
  ignoreError,
  isFunction, 
  isNull, 
  isObject, 
  parseMessage,
} from '../util'

import { 
  EnumValidateMode,
  EnumValidityState,
  ValidateObj,
  XField,
  XSchema,
  Emitter,
  ValidateFunc,
} from '../model'

import { nextTick, Ref } from 'vue'

export interface ValidateOptions { mode?: EnumValidateMode }

export interface RegisteredFieldState {
  fieldRef: Ref<XField>;
  onValidate: (options?: ValidateOptions) => Promise<void | string>;
  onValidChange: (e: any) => void;
  queue?: Set<Promise<any>>
}

export interface NormalizedOptions{
  enable: boolean;
  validator: ValidateFunc;
  mode: EnumValidateMode
}

interface XFieldValueEventDetail{
  field: XField,
  mode?: EnumValidateMode,
  callback?: (state: boolean, r?: any) => void
}

type RFS = Map<string, RegisteredFieldState>
type ComponentHandles = {
  onValueChange: (e: any) => void
}

const EVENTS = {
  XFIELD_VALID_CHANGE: 'xfield.valid.change'
}

function isValidateObj(v: any): v is ValidateObj{
  return v != null && 'mode' in v
}

function checkValidateMode(v: any){
  return v in EnumValidateMode
}

function eachFieldValue(value: any, callback: any): void{
  if(value == null || typeof value != 'object') return

  if(value instanceof XField) {
    callback(value)
    return eachFieldValue(value.value, callback)
  }

  if(Array.isArray(value)) return value.forEach(v => eachFieldValue(v, callback))
  if(isObject(value)) return Object.values(value).forEach(v => eachFieldValue(v, callback))
}

function normalizeOptions(field: XField, options?: ValidateOptions){
  const fca = field?.conf?.validator
  const external = isFunction(field?.validation?.external) ? field.validation.external() : null
  const enable = external !== false && fca !== false

  let validator = null
  let mode = EnumValidateMode.DEFAULT
  
  if(isValidateObj(fca)){
    checkValidateMode(fca.mode) && (mode = fca.mode)
    validator = fca.validator
  } else if(isFunction(fca)) {
    validator = fca
  }

  if(isFunction(external)) validator = external

  if(options != null){
    checkValidateMode(options.mode) && (mode = options.mode)
  }

  return { enable, validator, mode } as NormalizedOptions
}

function fallback(field: XField){
  return (
    field.required === true && isNull(field.value)
      ? Promise.reject('必填')
      : Promise.resolve()
  )
}

function validate(field: XField, RFS: RFS, vos?: ValidateOptions): Promise<string | void>{
  field.validation.validating = true

  const options = normalizeOptions(field, vos)
  if(!options.enable) return Promise.resolve()

  // 根据validator验证
  if(isFunction(options.validator)){
    return checkPromise<string>(options.validator(field, field.value, { mode: options.mode }))
  }

  // 默认验证函数，只验证`required`属性
  return fallback(field)
}

// 触发验证
function doValidate(detail: XFieldValueEventDetail, rfs: RFS){
  const state = rfs.get(detail.field.uid)
  const handle = state.onValidate
  const callback = detail.callback
  const options = { mode: detail.mode }

  if(!isFunction(handle) && isFunction(callback)) {
    return callback(true)
  }

  handle(options)
    .then(r => {
      isFunction(callback) && callback(true, r)
    })
    .catch(r => {
      isFunction(callback) && callback(false, r)
    })
}

function triggerValidChange(emitter: Emitter, detail: any){
  const newValue = detail.field.validation.valid
  const oldValue = detail.oldValid
  if(
    oldValue == newValue ||
    oldValue == EnumValidityState.NONE && newValue == EnumValidityState.SUCCESS ||
    newValue == EnumValidityState.NONE
  ) return

  nextTick(() => emitter.trigger(EVENTS.XFIELD_VALID_CHANGE, detail))
}

export function useValidator(handles: ComponentHandles){
  const RFS: RFS = new Map()
  const emitter = new Emitter()

  // 处理所有来自`XField`触发的事件
  function callback(name: string, detail: any){
    switch(name){
      case XField.EVENT_VALIDATE:
        // TODO: 标记触发来源
        doValidate(detail, RFS)
        break
      case XField.EVENT_VALUE_CHANGE:
        handles.onValueChange(detail)
        break
    }
  }

  function registerField(key: string, state: RegisteredFieldState){
    state.queue = new Set()
    const fieldRef = state.fieldRef
    // 订阅来自字段的事件
    fieldRef.value.subscribe(callback)

    // 只有包含子字段才触发
    if(fieldRef.value.fields.length > 0){
      state.onValidChange = function(e: { field: XField }){
        const field = e.field as XField
        const fields = fieldRef.value.fields
        // 如果子字段中没有相同name的字段，则不触发验证
        if(fields.every(f => f.name != field.name)) return
        // TODO: 标记触发来源
        nextTick(() => ignoreError(state.onValidate))
      }
      
      emitter.on(EVENTS.XFIELD_VALID_CHANGE, state.onValidChange)
    }

    RFS.set(key, state)
  }

  function removeField(key: string){
    if(!RFS.has(key)) return
    
    const state = RFS.get(key)
    RFS.delete(key)

    if(isFunction(state.onValidChange)) {
      emitter.off(EVENTS.XFIELD_VALID_CHANGE, state.onValidChange)
    }

    state.fieldRef.value.subscribe(null)
    state.onValidChange = null
    state.onValidate = null
    state.fieldRef = null
    state.queue = null
  }

  function validateField(field: XField, options?: ValidateOptions){
    if(field.validation.validating) return Promise.resolve()
    
    const promise = validate(field, RFS, options)
    const state = RFS.get(field.uid)
    state.queue.add(promise)
    return promise.then(r => {
      if(!state.queue.has(promise)) return 
      state.queue.delete(promise)
      
      const message = parseMessage(r)
      const oldValid = field.validation.valid
      field.validation.message = message
      field.validation.valid = EnumValidityState.SUCCESS
      field.validation.validating = false
      
      triggerValidChange(emitter, { field, oldValid })
      return message
    }).catch(error => {
      if(!state.queue.has(promise)) return 
      state.queue.delete(promise)

      const message = parseMessage(error)
      const oldValid = field.validation.valid

      field.validation.message = message
      field.validation.valid = EnumValidityState.ERROR
      field.validation.validating = false
      
      triggerValidChange(emitter, { field, oldValid })
      return Promise.reject(message)
    })
  }

  function validateSchema(schema: XSchema){
    const promises = schema
      .getNeedValidateFields()
      .map(f => {
        const state = RFS.get(f.uid)
        return state.onValidate({ mode: EnumValidateMode.RECURSIVE })
      })

    return Promise.allSettled(promises).then(r => {
      const result = { valid: r.every(i => i.status == 'fulfilled') } as any
      if(result.valid) result.model = schema.model

      return result
    })
  }

  function resetCallback(field: XField){
    if(!isObject(field.value)) field.value = undefined

    const state = RFS.get(field.uid)
    state.queue.clear()
    field.resetValidate()
  }

  function resetValidate(fields: XField[]){
    if(fields.length == 0) return
  
    eachFieldValue(fields, resetCallback)
  }

  return {
    registerField,
    resetValidate,
    removeField,
    validateField,
    validateSchema
  }
}