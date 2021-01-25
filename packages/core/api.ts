import { 
  inject,
  reactive
} from 'vue'

import { isObject } from './util/lang'

import {  
  XFormModel,
  XFormSchema,
  XField,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_MODEL_PROVIDE_KEY,
  XFormContext
} from '@model'

import Store from './store'

export {
  findElementFromPoint,
  getProperty,
  getXField
} from './util/dom'

export {
  getRef
} from './util/component'


export function useModel(){
  return inject(XFORM_MODEL_PROVIDE_KEY) as XFormModel
}

export function useContext<T = XFormContext>(){
  return inject<T>(XFORM_CONTEXT_PROVIDE_KEY)
}

export function createSchema(origin?: any){
  const o = isObject(origin) ? origin : {}
  const schema = { ...o }
  if(!Array.isArray(schema.fields)) schema.fields = []
  if(schema.fields.length > 0) schema.fields = schema.fields.map(XField.create)

  return reactive(schema as XFormSchema)
}

export function disableValidate(){
  Store.getConfig().validation.enable = false
}

export function enableValidate(){
  Store.getConfig().validation.enable = true
}