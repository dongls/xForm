import { ConcreteComponent, VNode } from 'vue'
import { RawProps, FormField, EnumComponent, FieldComponent } from '../model'
import { isObject, isPlainObject, isString } from './lang'

/** 获取字段配置的组件 */
export function getFieldComponent(field: FormField, target: EnumComponent, mode?: string){
  const r = field.conf?.[target]
  return (r instanceof FieldComponent ? r.get(field, mode) : r) as ConcreteComponent | VNode
}

/** 获取ref对应的dom或组件 */
export function getRef<T>(refs: Record<string, unknown>, key: string): T{
  return refs[key] as T
}

/** 获取ref对应的HTMLElement */
export function getHtmlElement(refs: Record<string, unknown>, key: string){
  return getRef<HTMLElement>(refs, key)
}

export function fillComponentProps(component: unknown, all: RawProps, base: RawProps = {}){
  const { props, emits } = component as { props?: object, emits?: string[] }

  let defs: string[] = []
  if(null != props){
    defs = defs.concat(Object.keys(props))
  }

  if(Array.isArray(emits)){
    defs = defs.concat(emits.map(genEventName))
  }

  return defs.reduce((acc, key) => {
    const v = all[key]
    if(v != null) acc[key] = v
    return acc  
  }, base)
}

export function genEventName(name: string){
  return 'on' + name[0].toUpperCase() + name.slice(1)
}

function _normalizeClass(value: unknown){
  if(isObject(value)) return value

  if(isString(value)){
    value = value.split(' ').filter(v => v)
  }

  if(Array.isArray(value)){
    return value.reduce((acc, v) => {
      acc[v] = true
      return acc
    }, {} as any)
  }

  return {}
}

export function normalizeClass(value: unknown, o?: unknown){
  const klass = _normalizeClass(value)
  return isPlainObject(o) ? Object.assign(klass, o) : klass
}