import { ComponentOptions } from 'vue'
import { isObject } from '../util'
import { store } from './Store'

export function registerSlots(o: { [prop: string]: ComponentOptions }){
  if(!isObject(o)) return

  for(const key in o){
    const slot = o[key]
    registerSlot(key, slot)
  }
}

export function registerSlot(key: string, slot: ComponentOptions){
  store.slots.set(key, slot)
}

export function getSlot(key: string){
  return store.slots.get(key)
}

export function removeSlot(key: string){
  store.slots.delete(key)
}