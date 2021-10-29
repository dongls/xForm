import { FormPreset } from '../model'
import { store } from './Store'
import { useConfig } from './Config'
import { registerField, removeField } from './Field'

export function usePreset(preset: FormPreset){
  if(null == preset) return
  store.preset = Object.assign(store.preset || {}, preset)
  registerField(preset.fieldConfs)
  useConfig(preset.config)
}

export function resetPreset(){
  // 删除字段配置
  const fieldConfs = store.preset?.fieldConfs ?? []
  for(const fc of fieldConfs) removeField(fc.type)
  
  store.preset = null
}

export function getPreset(){
  return store.preset
}
