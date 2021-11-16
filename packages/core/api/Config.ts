import { FormConfig } from '../model'
import { clonePlainObject, mergePlainObject } from '../util'
import { store, createConfig } from './Store'

export function useConfig(config: FormConfig){
  if(config == null) return

  const clone = clonePlainObject(config)
  mergePlainObject(store.config, clone)

  if(store.config.logic === true){
    console.warn('[xForm]: 字段逻辑目前为实验性功能，未来可能会发生变更，请谨慎使用！')
  }
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