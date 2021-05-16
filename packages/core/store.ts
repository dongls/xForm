import { 
  FieldConf, 
  FormConfig, 
  FormConfigBase,
  FormOption, 
  FormPreset,
  ModeGroup, 
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
  preset: null as FormPreset,
  config: clonePlainObject(CONFIG) as FormConfigBase,
  fields: new Map<string, FieldConf>(),
}

export function useConfig(config: FormConfig){
  const clone = clonePlainObject(config)
  mergePlainObject(store.config, clone)
}

export function usePreset(preset: FormPreset){
  if(null == preset) return
  store.preset = Object.assign(store.preset || {}, preset)
  register(preset.fieldConfs)
  if(null != preset.config) useConfig(preset.config)
}

export function use(option: FormOption){
  if(option.preset) usePreset(option.preset)
  if(option.config) useConfig(option.config)
  // TODO: support install ?
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

export function reset(option?: FormOption){
  // TODO: 重置操作符
  resetPreset()
  resetConfig()
  if(store.fields.size > 0) resetField()
  if(null != option) use(option)
}

/** 注册字段 */
// TODO: registerField
export function register(...fcs: Array<FieldConf | FieldConf[]>){
  flat(fcs).forEach(fc => {
    if(fc instanceof FieldConf && fc.available){
      store.fields.set(fc.type, fc)
    }
  })
}

export function hasFieldConf(type: string){
  return store.fields.has(type)
}

export function findFieldConf(path: string){
  if(isNull(path) || isEmpty(path)) return null

  const index = path.indexOf(DELIMITER)
  const type = index >= 0 ? path.slice(0, index) : path
  const fc = store.fields.get(type)
  
  if(isNull(fc)) {
    if(__IS_DEV__) console.warn(`[xform]: 请先注册字段类型[${type}]`)
    return null
  }

  if(index < 0) return fc
  const dep = fc.dependencies.find(f => f.type == path)
  if(isNull(dep)){
    if(__IS_DEV__) console.warn(`[xform]: 请先注册字段类型[${path}]`)
    return null
  }

  return dep
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

/** 只用于测试 */
export function getRawStore(){
  return __IS_TEST__ ? store : null
}

export default {
  findFieldConf,
  findFieldGroups,
  getConfig,
  getPreset,
  hasFieldConf,
  isImmediateValidate,
  register,
  reset,
  resetConfig,
  resetField,
  resetPreset,
  use,
  useConfig,
  usePreset,
}