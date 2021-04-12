import { 
  computed,
  inject,
  ref,
  Ref,
} from 'vue'

import { isObject } from './util'

import {  
  FormField,
  FormRenderContext,
  FormSchema,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_SCHEMA_PROVIDE_KEY,
} from './model'

export {
  checkCondition,
  findElementFromPoint,
  findElementsFromPoint,
  genRandomStr,
  getField,
  getHtmlElement,
  getOperator,
  getProperty,
  getRef,
  isEmpty,
  normalizeClass,
  normalizeWheel,
} from './util'

export function useRenderContext<T = FormRenderContext>(){
  return inject<T>(XFORM_CONTEXT_PROVIDE_KEY)
}

export function createSchema(origin?: any, model?: any){
  const o = isObject(origin) ? origin : {}
  return new FormSchema(o, model)
}

export function createSchemaRef(origin?: any, model?: any){
  return ref(createSchema(origin, model)) as Ref<FormSchema>
}

/** @deprecated */
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