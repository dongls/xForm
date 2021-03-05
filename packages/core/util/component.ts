import { RawProps, XField, EnumComponent, FieldComponent, XFormScope } from '../model'
import { isFunction, isObject, isString } from './lang'

/** 获取字段配置的组件 */
export function getFieldComponent(field: XField, target: EnumComponent, mode?: string){
  const component = field.conf?.[target]
  if(!(component instanceof FieldComponent)) return component

  if(isFunction(component.factory)) return component.factory(field, mode)

  return component.extension[`${mode}_${field.name}`] || component.extension[mode]
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

export function normalizeClass(value: unknown){
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

export function getAllFields(scope: XFormScope): XField[] {
  return scope.fields.reduce((acc, f) => {
    acc.push(f)

    if(Array.isArray(f.fields) && f.fields.length > 0){
      const sub = getAllFields(f)
      return acc.concat(sub)
    }

    return acc
  }, []) as XField[]
}
