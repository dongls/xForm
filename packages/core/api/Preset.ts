import { FormPreset } from '../model'
import { store } from './Store'
import { isFunction } from '../util'

export function usePreset(preset: FormPreset, options?: any){
  if(null == preset || !isFunction(preset.install)) return

  store.preset = {
    name: preset.name,
    version: preset.version,
    cleanup: preset.install(options)
  }
}

export function resetPreset(){
  if(store.preset == null) return
  if(isFunction(store.preset.cleanup)) store.preset.cleanup()

  store.preset = null
}

export function getPreset(){
  return store.preset
}
