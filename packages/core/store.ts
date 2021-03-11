import { 
  XFieldConf, 
  XFormConfig, 
  XFormOption, 
  XFormPreset,
  ModeGroup, 
  XFormConfigBase
} from './model'

import { 
  clonePlainObject, 
  mergePlainObject, 
  isNull, 
  isEmpty,
  flat
} from './util'

import CONFIG from './config'

const DELIMITER = '.'

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

export function resetField(){
  store.fields.clear()
}

export function reset(option?: XFormOption){
  resetPreset()
  resetConfig()
  if(store.fields.size > 0) resetField()
  if(null != option) use(option)
}

/** 注册单个字段 */
export function registerField(fc: XFieldConf){
  if(!(fc instanceof XFieldConf) || !fc.available) return
  
  store.fields.set(fc.type, fc)
}

/** 注册任意个字段 */
export function registerManyField(...fcs: Array<unknown>){
  flat(fcs).forEach(f => f instanceof XFieldConf && registerField(f))  
}

export function hasField(type: string){
  return store.fields.has(type)
}

export function findFieldConf(path: string){
  if(isNull(path) || isEmpty(path)) return null

  const index = path.indexOf(DELIMITER)
  const type = index >= 0 ? path.slice(0, index) : path
  const fc = store.fields.get(type)
  if(isNull(fc) || index < 0) return fc

  return fc.dependencies.find(f => f.type == path)
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
  for(const g of groups) g.fieldConfs = g.types.map(findFieldConf).filter(f => f && f.available)
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

export default {
  findFieldConf,
  findFieldGroups,
  getConfig,
  getPreset,
  hasField,
  isImmediateValidate,
  registerField,
  registerManyField,
  reset,
  resetConfig,
  resetField,
  resetPreset,
  use,
  useConfig,
  usePreset,
}