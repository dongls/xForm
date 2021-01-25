import { 
  XFieldConf, 
  XFormConfig, 
  XFormOption, 
  XFormPreset 
} from './model'

import { 
  clonePlainObject, 
  mergePlainObject, 
  isNull, 
  isEmpty
} from './util/lang'

import { 
  ModeGroup, 
  XFormConfigBase
} from '@core/model'

import CONFIG from './config'

const store = {
  preset: null as XFormPreset,
  config: clonePlainObject(CONFIG) as XFormConfigBase,
  fields: new Map<string, XFieldConf>()
}

export function useConfig(config: XFormConfig){
  const clone = clonePlainObject(config)
  mergePlainObject(store.config, clone)
}

export function usePreset(preset: XFormPreset){
  if(null == preset) return
  store.preset = Object.assign(store.preset || {}, preset)
  preset.fieldConfs.forEach(registerField)
}

export function use(option: XFormOption){
  if(option.config) useConfig(option.config)
  if(option.preset) usePreset(option.preset)
}

export function resetPreset(){
  // 删除字段配置
  const fieldConfs = store.preset?.fieldConfs ?? []
  for(const fc of fieldConfs){
    const value = store.fields.get(fc.type)
    if(fc === value) store.fields.delete(fc.type)
  }

  store.preset = null
}

export function resetConfig(){
  store.config = clonePlainObject(CONFIG)
}

export function reset(option?: XFormOption){
  resetPreset()
  resetConfig()
  if(null != option) use(option)
}

/** 注册单个字段 */
export function registerField(fc: XFieldConf){
  if(!(fc instanceof XFieldConf) || !fc.available) return
  
  store.fields.set(fc.type, fc)
}

/** 注册任意个字段 */
export function registerManyField(...fcs: Array<unknown>){
  fcs.flat().forEach(f => f instanceof XFieldConf && registerField(f))  
}

export function hasField(type: string){
  return store.fields.has(type)
}

export function findFieldConf(type: string){
  if(isNull(type) || isEmpty(type)) return null

  const fc = store.fields.get(type)
  return fc instanceof XFieldConf ? fc : null
}

function findMode(mode?: string){
  // 默认显示所有字段
  if(mode == null || null == store.config.modes) return Array.from(store.fields.keys())

  const types = store.config.modes[mode]
  return Array.isArray(types) ? types.filter(t => null != t) : []
}

export function findFieldGroups(name?: string){
  const mode = findMode(name)
  if(mode.length == 0) return []

  const groups = (typeof mode[0] != 'object' ? [{ types: mode }] : mode) as ModeGroup[]
  for(const g of groups) g.fieldConfs = g.types.map(findFieldConf)
  return groups
}

export function getConfig(){
  return store.config
}

export function getPreset(){
  return store.preset
}

export function isImmediateValidate(){
  return store.config.validation.immediate !== false
}

export function isEnableValidate(){
  return store.config.validation.enable === true
}

export default {
  findFieldConf,
  findFieldGroups,
  getConfig,
  getPreset,
  hasField,
  isEnableValidate,
  isImmediateValidate,
  registerField,
  registerManyField,
  reset,
  resetConfig,
  resetPreset,
  use,
  useConfig,
}