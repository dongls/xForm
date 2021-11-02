import { FormPreset } from '../model'
import { store } from './Store'
import { useConfig } from './Config'
import { registerField, removeField } from './Field'
import { registerSlots, removeSlot } from './Slots'
import { isObject } from '../util'

export function usePreset(preset: FormPreset){
  if(null == preset) return

  store.preset = preset
  
  useConfig(preset.config)
  registerField(preset.fieldConfs)
  registerSlots(preset.slots)
}

export function resetPreset(){
  const preset = store.preset

  // 删除字段配置
  const fieldConfs = preset?.fieldConfs ?? []
  for(const fc of fieldConfs) removeField(fc.type)

  // 删除slot
  const slots = preset?.slots
  if(isObject(slots)){
    for(const key in slots) removeSlot(key)
  }
  
  store.preset = null
}

export function getPreset(){
  return store.preset
}
