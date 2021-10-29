import { FormConfig } from '../model'
import { clonePlainObject, mergePlainObject } from '../util'
import { store, createConfig } from './Store'

export function useConfig(config: FormConfig){
  if(config == null) return

  const clone = clonePlainObject(config)
  mergePlainObject(store.config, clone)
}

export function resetConfig(){
  store.config = createConfig()
}

export function getConfig(){
  return store.config
}

export function isImmediateValidate(){
  return store.config.validation.immediate !== false
}