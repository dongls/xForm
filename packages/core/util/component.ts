import { RawProps, XField, ComponentEnum } from '@core/model'
import { isFunction } from './lang'

/** 获取字段配置的组件 */
export function getFieldComponent(field: XField, target: ComponentEnum, mode?: string){
  const component = field.conf?.[target]
  return isFunction(component) ? component(field, mode) : component
}
 
/**
 * 生成提示信息
 * @param {XFiled} field - 字段对象
 * @returns {string}
 */
export function genPlaceholder(field: XField){
  if(null == field) return ''

  const prefix = field.required ? field.type == 'select' ? '[必选] ' : '[必填] ' : ''
  const placeholder = field.placeholder || ''
  return `${prefix}${placeholder}` || null
}

/** 获取ref对应的dom或组件 */
export function getRef<T>(refs: Record<string, unknown>, key: string): T{
  return refs[key] as T
}

/** 获取ref对应的HTMLElement */
export function getHtmlElement(refs: Record<string, unknown>, key: string){
  return getRef<HTMLElement>(refs, key)
}

export function buildComponentProps(defs: unknown, props: any){
  if(null == defs || typeof defs != 'object') return {}

  return Object.keys(defs).reduce((acc, key) => {
    acc[key] = props[key]
    return acc
  }, {} as RawProps)
}

export function genEventName(name: string){
  return 'on' + name[0].toUpperCase() + name.slice(1)
}