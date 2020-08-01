import { 
  inject,
  reactive
} from 'vue'

import { isObject } from './util/lang'

import {  
  XFormModel,
  XFormSchema, 
  XField,
  XFORM_MODEL_PROVIDE_KEY 
} from '@core/model'

export function useModel(){
  return inject(XFORM_MODEL_PROVIDE_KEY) as XFormModel
}

export function createSchema(origin?: any){
  const o = isObject(origin) ? origin : {}
  const schema = { ...o }
  if(!Array.isArray(schema.fields)) schema.fields = []
  if(schema.fields.length > 0) schema.fields = schema.fields.map((f: any) => f instanceof XField ? f : new XField(f))

  return reactive(schema as XFormSchema)
}