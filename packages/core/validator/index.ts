import store from '@core/store'

import { 
  getAllFields 
} from '@core/util/component'

import { 
  checkPromise,
  isFunction, 
  isNull, 
  parseMessage, 
  toArray 
} from '@core/util/lang'

import { 
  EnumValidateMode,
  EnumValidityState,
  RegisteredFieldState, 
  ValidateOptions, 
  ValidResult, 
  XField, 
  XFieldConf, 
  XFormModel, 
  XFormScope 
} from '@model'

type RFS = Map<string, RegisteredFieldState>
type Addition = { mode?: EnumValidateMode }

function getNeedValidateFields(scope: XFormScope, rfs: RFS){
  const internal = toArray<XField>(scope.fields).filter(i => rfs.has(i.name))
  const external = scope instanceof XField ? [] : (function(){
    const all = getAllFields(scope)
    const arr = [] as XField[]

    for(const [, v] of rfs){
      const field = v.fieldRef.value
      if(all.indexOf(field) < 0) arr.push(field)
    }
    
    return arr
  })()

  return internal.concat(external)
}

function isValidateOptions(v: any): v is ValidateOptions{
  return v != null && 'mode' in v
}

function checkValidateMode(v: any){
  return [
    EnumValidateMode.DEFAULT, 
    EnumValidateMode.SLEF
  ].includes(v)
}

function normalizeOptions(fc: XFieldConf, state: RegisteredFieldState, addition?: Addition){
  const fca = fc?.validator
  const validationRef = state.validationRef
  const enable = store.isEnableValidate() && validationRef.value !== false && fca !== false

  let validator = null
  let mode = EnumValidateMode.DEFAULT
  
  if(isValidateOptions(fca)){
    checkValidateMode(fca.mode) && (mode = fca.mode)
    validator = fca.validator
  } else if(isFunction(fca)) {
    validator = fca
  }

  if(isFunction(validationRef.value)) validator = validationRef.value

  if(addition != null){
    checkValidateMode(addition.mode) && (mode = addition.mode)
  }

  return { enable, validator, mode }
}

function fallback(field: XField, model: XFormModel){
  return (
    field.required === true && isNull(model[field.name])
      ? Promise.reject('必填')
      : Promise.resolve()
  )
}

function validateSelf(field: XField, model: XFormModel, options: ValidateOptions){
  if(isFunction(options.validator)){
    return options.validator(field, model)
  }

  if(field.hasSubField){
    return (
      field.fields.some(f => f.validation.valid === EnumValidityState.ERROR) 
        ? Promise.reject() 
        : Promise.resolve()
    )
  }

  return fallback(field, model)
}

function isCanceled(vi: any){
  return vi.canceled === true
}

export function useValidator(){
  const REGISTERED_FIELDS: RFS = new Map()

  function validate(field: XField, model: XFormModel, addition?: Addition): Promise<string | void>{
    field.validation.validating = true
  
    const options = normalizeOptions(field.conf, REGISTERED_FIELDS.get(field.name), addition)
    if(!options.enable) return Promise.resolve()
  
    // 只验证自身
    if(options.mode == EnumValidateMode.SLEF){
      return validateSelf(field, model, options)
    }
  
    // 验证子字段
    if(field.hasSubField){
      return validateScope(field, model).then(r => {
        if(isFunction(options.validator)) return checkPromise<string>(options.validator(field, model))
  
        return r.some(i => i.status === 'rejected') ? Promise.reject() : Promise.resolve()
      })
    }
  
    // 根据validator验证
    if(isFunction(options.validator)){
      return checkPromise<string>(options.validator(field, model))
    }
  
    // 默认验证函数，只验证`required`属性
    return fallback(field, model)
  }
  
  function validateScope(scope: XFormScope, model: XFormModel){
    const promises = getNeedValidateFields(scope, REGISTERED_FIELDS).map(f => validateField(f, model))
    return Promise.allSettled(promises)
  }

  function validateField(field: XField, model: XFormModel, addition?: Addition){
    if(field.validation.validating || !store.isEnableValidate()) return Promise.resolve()
  
    const promise = validate(field, model, addition)
    const state = REGISTERED_FIELDS.get(field.name)
    state.queue.add(promise)
    return promise.then(r => {
      state.queue.delete(promise)
      if(isCanceled(promise)) return 
      
      const message = parseMessage(r)
      field.validation.message = message
      field.validation.valid = EnumValidityState.SUCCESS
      field.validation.validating = false      
      return message
    }).catch(error => {
      state.queue.delete(promise)
      if(isCanceled(promise)) return
  
      const message = parseMessage(error)
      field.validation.message = message
      field.validation.valid = EnumValidityState.ERROR
      field.validation.validating = false
      return Promise.reject(message)
    })
  }
  
  function validateSchema(scope: XFormScope, model: XFormModel, flat = false){
    return validateScope(scope, model)
      .then(r => {
        return {
          result: extractValidResult(scope, flat), 
          valid: r.every(i => i.status == 'fulfilled')
        }
      })
  }

  function extractValidResult(scope: XFormScope, flat = false): ValidResult[]{
    return getNeedValidateFields(scope, REGISTERED_FIELDS).reduce((acc, f) => {
      const fields = extractValidResult(f, flat)
      const r = {
        valid: f.validation.valid !== EnumValidityState.ERROR,
        message: f.validation.message,
        name: f.name,
        title: f.title,
        type: f.type
      } as ValidResult

      acc.push(r)

      return flat ? acc.concat(fields) : (r.fields = fields, acc)
    }, [])
  }

  function validateFieldByName(name: string, model: XFormModel, addition?: Addition){
    const state = REGISTERED_FIELDS.get(name)
    const field = state?.fieldRef?.value
    return isNull(field) ? Promise.resolve() : validateField(field, model, addition)
  }

  function registerField(key: string, state: Partial<Pick<RegisteredFieldState, 'queue'>> & Omit<RegisteredFieldState, 'queue'>){
    if(!(state.queue instanceof Set)) state.queue = new Set()
    REGISTERED_FIELDS.set(key, state as RegisteredFieldState)
  }

  function removeField(key: string){
    const state = REGISTERED_FIELDS.get(key)
    if(null != state) REGISTERED_FIELDS.delete(key)
    return state
  }

  function resetFieldValidation(field: XField){
    field.validation.valid = EnumValidityState.NONE
    field.validation.validating = false
    field.validation.message = null

    const state = REGISTERED_FIELDS.get(field.name)
    if(state?.queue instanceof Set){
      for(const p of state.queue) p.canceled = true
    }
  }

  function getRegisteredFields(){
    return Array.from(REGISTERED_FIELDS.values())
      .map(i => i.fieldRef.value)
      .filter(i => i != null)
  }

  return {
    extractValidResult,
    getRegisteredFields,
    registerField,
    removeField,
    resetFieldValidation,
    validateField,
    validateFieldByName,
    validateSchema,
  }
}