import * as constant from '../model/constant'

import { 
  inject,
  ref,
  Ref,
} from 'vue'

import {  
  FormOption,
  FormRenderContext,
  FormSchema,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_SCHEMA_PROVIDE_KEY,
} from '../model'

import { 
  freeze,
  isObject 
} from '../util'

import { resetConfig, useConfig } from './Config'
import { resetPreset, usePreset } from './Preset'
import { resetField } from './Field'

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

export { 
  getConfig,
  isImmediateValidate,
  resetConfig,
  useConfig,
} from './Config'

export { 
  genDefaultValue,
  registerDefaultValueType,
  removeDefaultValueType,
} from './DefaultValue'

export {
  findField,
  findModeGroup,
  hasField,
  registerField,
  removeField,
  resetField,
} from './Field'

export {
  getPreset,
  resetPreset,
  usePreset,
} from './Preset'

export { createConfig } from './Store'

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

// TODO: support install ?
export function use(option: FormOption){
  if(option.preset) usePreset(option.preset)
  if(option.config) useConfig(option.config)
}

export function reset(option?: FormOption){
  resetPreset()
  resetConfig()
  resetField()
  
  if(null != option) use(option)
}