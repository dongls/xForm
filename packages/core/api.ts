import { 
  computed,
  inject,
  ref,
  Ref,
} from 'vue'

import { isObject } from './util/lang'

import {  
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_SCHEMA_PROVIDE_KEY,
  XField,
  XFormRenderContext,
  XSchema,
} from './model'

export {
  findElementFromPoint,
  findElementsFromPoint,
  getProperty,
  getRef,
  getHtmlElement,
  getXField,
  normalizeClass,
  normalizeWheel,
  isEmpty,
  genRandomStr
} from './util'

export function useRenderContext<T = XFormRenderContext>(){
  return inject<T>(XFORM_CONTEXT_PROVIDE_KEY)
}

export function createSchema(origin?: any, model?: any){
  const o = isObject(origin) ? origin : {}
  return new XSchema(o, model)
}

export function createSchemaRef(origin?: any, model?: any){
  return ref(createSchema(origin, model)) as Ref<XSchema>
}

export function useValue<T>(props: { field: XField }, defValue?: T){
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
  return inject(XFORM_SCHEMA_PROVIDE_KEY) as Ref<XSchema>
}