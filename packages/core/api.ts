import { 
  computed,
  inject,
  ref,
  Ref,
  toRef
} from 'vue'

import { isObject } from './util/lang'

import {  
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFormRenderContext,
  XSchema,
  XField,
  XFORM_FORM_SCHEMA_PROVIDE_KEY,
} from './model'

export {
  findElementFromPoint,
  findElementsFromPoint,
  getProperty,
  getRef,
  getHtmlElement,
  getXField,
  normalizeClass,
  normalizeWheel
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
  const r = toRef(props, 'field') as Ref<XField>
  return computed<T>({
    get(){
      return r.value.value ?? defValue
    },
    set(v){
      r.value.value = v 
    }
  })
}

export function useSchema(){
  return inject(XFORM_FORM_SCHEMA_PROVIDE_KEY) as Ref<XSchema>
}