import { isObject, toArray } from '../util/lang'

export class Serializable{
  static readonly EXCLUDE_PROPS_KEY = Symbol()

  toJSON(){
    const origin = this as any
    const ctor = this.constructor as any
    const props = toArray(ctor[Serializable.EXCLUDE_PROPS_KEY])
    return Object.keys(origin)
      .filter(i => props.indexOf(i) < 0)
      .reduce((acc, k) => ((acc[k] = getValue(origin[k])), acc), {} as any)
  }
}

function getValue(value: unknown): any{
  if(null == value) return value
  if(value instanceof Serializable) return value.toJSON()
  if(Array.isArray(value)) return value.map(getValue)
  if(isObject(value)) {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = getValue((value as any)[key])
      return acc
    }, {} as any)
  }

  return value
}