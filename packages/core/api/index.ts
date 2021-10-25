import * as constant from '../model/constant'

import { 
  inject,
  ref,
  Ref,
} from 'vue'

import {  
  FormRenderContext,
  FormSchema,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_SCHEMA_PROVIDE_KEY,
} from '../model'

import { 
  freeze,
  isObject 
} from '../util'

export {
  findElementFromPoint,
  findElementsFromPoint,
  genRandomStr,
  getField,
  getHtmlElement,
  getProperty,
  getRef,
  isEmpty,
  normalizeClass,
  normalizeWheel,
} from '../util'

export { useStore } from './store'

export * from './DefaultValue'

export { getOperator, getOperators } from '../logic'

export function useRenderContext<T = FormRenderContext>(){
  return inject<T>(XFORM_CONTEXT_PROVIDE_KEY)
}

export function createSchema(origin?: any, model?: any){
  const o = isObject(origin) ? origin : {}
  return FormSchema.create(o, model)
}

export function createSchemaRef(origin?: any, model?: any){
  return ref(createSchema(origin, model)) as Ref<FormSchema>
}

export function useSchema(){
  return inject(XFORM_SCHEMA_PROVIDE_KEY) as Ref<FormSchema>
}

export function useConstant(){
  return freeze(constant, true)
}