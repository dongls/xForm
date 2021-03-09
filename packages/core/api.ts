import { 
  inject,
  ref,
  Ref
} from 'vue'

import { isObject } from './util/lang'

import {  
  XFormModel,
  XFormSchema,
  XField,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_MODEL_PROVIDE_KEY,
  XFormRenderContext,
} from './model'

export {
  findElementFromPoint,
  findElementsFromPoint,
  getProperty,
  getRef,
  getXField,
  normalizeClass,
} from './util'

export function useModel(){
  return inject(XFORM_MODEL_PROVIDE_KEY, null) as Ref<XFormModel>
}

export function useRenderContext<T = XFormRenderContext>(){
  return inject<T>(XFORM_CONTEXT_PROVIDE_KEY)
}

export function createSchema(origin?: any){
  const o = isObject(origin) ? origin : {}
  const schema = { ...o }
  if(!Array.isArray(schema.fields)) schema.fields = []
  if(schema.fields.length > 0) schema.fields = schema.fields.map(XField.create)

  return schema as XFormSchema
}

export function createSchemaRef(origin?: any){
  return ref(createSchema(origin)) as Ref<XFormSchema>
}