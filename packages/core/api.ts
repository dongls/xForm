import { isObject } from './util'
import { constant } from './model/exports'

import { 
  computed,
  inject,
  ref,
  Ref,
} from 'vue'

import {  
  FormField,
  FormRenderContext,
  FormSchema,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_SCHEMA_PROVIDE_KEY,
} from './model'

import store from './store'

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
} from './util'

export { getOperator, getOperators } from './logic'
export { getConfig, reset } from './store'

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

/** @deprecated use `field.value` instead */
export function useValue<T>(props: { field: FormField }, defValue?: T){
  return computed<T>({
    get(){
      return props.field.value ?? defValue
    },
    set(v){
      props.field.value = v 
    }
  })
}

export function useSchema(){
  return inject(XFORM_SCHEMA_PROVIDE_KEY) as Ref<FormSchema>
}

export function useFormStore(){
  return store
}

export function useConstant(){
  return constant
}

// TODO: useApi