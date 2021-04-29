import { ComputedRef, onBeforeUnmount, Ref, watch } from 'vue'

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
  FormField,
  FormSchema,
  ValidateFunc,
  Action,
} from '../model'

export interface ValidateOptions { mode?: EnumValidateMode }

export interface NormalizedOptions{
  enable: boolean;
  validator: ValidateFunc;
  mode: EnumValidateMode
}

type ValidatePromise = Promise<string | void> & { uid?: string }

function isValidateObj(v: any): v is ValidateObj{
  return v != null && 'mode' in v
}

function checkValidateMode(v: any){
  return v in EnumValidateMode
}

function eachFieldValue(value: any, callback: any): void{
  if(value == null || typeof value != 'object') return

  if(value instanceof FormField) {
    callback(value)
    return eachFieldValue(value.value, callback)
  }

  if(Array.isArray(value)) return value.forEach(v => eachFieldValue(v, callback))
  if(isObject(value)) return Object.values(value).forEach(v => eachFieldValue(v, callback))
}

function normalizeOptions(field: FormField, options?: ValidateOptions){
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

function fallback(field: FormField){
  return (
    field.required === true && isNull(field.value)
      ? Promise.reject('必填')
      : Promise.resolve()
  )
}

function validate(field: FormField, vos?: ValidateOptions): ValidatePromise{
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

export function useValidator(schemaRef: Ref<FormSchema>, disabledRef: ComputedRef<boolean>){
  const queue = new Set<ValidatePromise>()
  const stopMap = new WeakMap<FormSchema, Function>()

  function effect(action: Action){
    switch (action.type) {
      case 'value.change': {
        ignoreError(validateField(action.field.reactive()))
        break
      }
      case 'validate': {
        const options = { mode: action.mode }
        const callback = action.callback
        validateField(action.field.reactive(), options)
          .then((r: any) => isFunction(callback) && callback(true, r))
          .catch(r => isFunction(callback) && callback(false, r))
        break
      }
      case 'valid.change': {
        const newValue = action.newValue
        const oldValue = action.oldValue
        if(
          oldValue == newValue ||
          oldValue == EnumValidityState.NONE && newValue == EnumValidityState.SUCCESS ||
          newValue == EnumValidityState.NONE
        ) return
        
        const parent = action.field.parent
        if(parent instanceof FormField) ignoreError(validateField(parent.reactive()))
        break
      }
    }
  }

  function validateField(field: FormField, options?: ValidateOptions){
    if(disabledRef.value) return Promise.resolve()
    if(field.validation.validating) return Promise.resolve()
    
    const promise = validate(field, options)
    promise.uid = field.uid
    queue.add(promise)
    return promise.then(r => {
      if(!queue.has(promise)) return 
      queue.delete(promise)
      
      const message = parseMessage(r)
      field.validation.message = message
      field.validation.valid = EnumValidityState.SUCCESS
      field.validation.validating = false
      
      return message
    }).catch(error => {
      if(!queue.has(promise)) return 
      queue.delete(promise)

      const message = parseMessage(error)

      field.validation.message = message
      field.validation.valid = EnumValidityState.ERROR
      field.validation.validating = false
      
      return Promise.reject(message)
    })
  }

  function validateSchema(schema: FormSchema){
    const promises = schema
      .getNeedValidateFields()
      .map(f => f.validate({ mode: EnumValidateMode.RECURSIVE }))

    return Promise.allSettled(promises).then(r => {
      const result = { valid: r.every(i => i.status == 'fulfilled') } as any
      if(result.valid) result.model = schema.model

      return result
    })
  }

  function resetCallback(field: FormField){
    if(!isObject(field.value)) field.value = undefined

    queue.forEach(p => p.uid === field.uid && queue.delete(p))
    field.resetValidate()
  }

  function resetValidate(fields: FormField[]){
    if(fields.length == 0) return
  
    eachFieldValue(fields, resetCallback)
  }

  function destroy(){
    queue.clear()
  }

  function use(schema: FormSchema = schemaRef.value){
    const callback = schema.useEffect(effect)
    stopMap.set(schema, callback)
  }

  function stop(schema: FormSchema = schemaRef.value){
    const callback = stopMap.get(schema)
    if(isFunction(callback)) {
      callback()
      stopMap.delete(schema)
    }
  }

  watch(schemaRef, (newSchema, oldSchema) => {
    stop(oldSchema)
    use(newSchema)    
  })

  use(schemaRef.value)
  onBeforeUnmount(() => {
    stop()
    destroy()
  })

  return {
    resetValidate,
    validateField,
    validateSchema,
    destroy
  }
}