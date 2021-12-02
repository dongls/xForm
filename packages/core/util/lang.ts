import { DeepReadonly, isReactive, isRef, toRaw } from 'vue'
import { AnyProps } from '../model/common'

const OBJECT_TO_STRING = Object.prototype.toString
const OBJECT_TO_STRING_TAG = {
  RegExp: '[object RegExp]'
}

export function getObjectTag(value: unknown): string{
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }

  return OBJECT_TO_STRING.call(value)
}

let seed = 0
export function getIncNum(){
  return seed++
}

export function isString(value: unknown): value is string{
  return typeof value === 'string'
}

/** 
 * 是否为空值
 * - null、undefined
 * - string: 空字符串
 * - number: NaN, Infinity
 * - Array: 长度为0
 */
export function isEmpty(value: unknown){
  if(value == null) return true
  if(isString(value)) return value.trim().length == 0
  if(isNumber(value)) return isNaN(value) || !isFinite(value)
  if(Array.isArray(value)) return value.length == 0 

  return false
}

export function isNumber(value: unknown): value is number{
  return typeof value === 'number'
}

export function isNull(value: unknown): value is null{
  return value == null
}

/** 是否为对象 */
export function isObject(value: unknown, withFunc = false){
  if(value == null) return false

  return withFunc ? (typeof value == 'object' || typeof value == 'function') : typeof value == 'object'
}

/** 是否为正则表达式 */
export function isRegExp(value: unknown): value is RegExp{
  return isObject(value) && getObjectTag(value) == OBJECT_TO_STRING_TAG.RegExp
}

export function isFunction(value: unknown): value is Function{
  return typeof value == 'function'
}

export function isSymbol(value: unknown): value is Symbol{
  return typeof value == 'symbol'
}

/** 是否为简单对象 @see https://github.com/lodash/lodash/blob/master/isPlainObject.js */
export function isPlainObject<T>(value: unknown): value is T{
  if (value == null || typeof value != 'object' || getObjectTag(value) != '[object Object]') {
    return false
  }

  if (Object.getPrototypeOf(value) === null) {
    return true
  }

  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(value) === proto
}

/**
 * 克隆简单对象
 * @param {object} target - 待克隆的对象
 * @returns 克隆后的对象
 */
export function clonePlainObject(target: any): any{
  if(null == target || typeof target != 'object') return target
  if(isRaw(target)) return target
  if(Array.isArray(target)) return target.map(clonePlainObject)

  return Object.keys(target).reduce((acc, key) => {
    acc[key] = clonePlainObject(target[key])
    return acc
  }, {} as any)
}

function merge(target: any, source: any){
  Object.keys(source).forEach(prop => {
    const value = source[prop]
    if(value === undefined) return

    // null、数组和非object对象直接替换
    if(null === value || typeof value != 'object' || Array.isArray(value)){
      target[prop] = value
      return
    }

    const tarValue = target[prop]
    target[prop] = merge(isObject(tarValue) ? tarValue : {}, value)
  })

  return target
}

/** 合并简单对象 */
export function mergePlainObject(...source: any[]){
  if(source.length < 2) return source[0]
  
  let target = source[0]
  for(let i = 1; i < source.length; i++){
    target = merge(target, source[i])
  }

  return target
}

export function toNumber(val: any){
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

export function toArray<T>(value: unknown, def: Array<T> = []): Array<T>{
  return Array.isArray(value) ? value : def
}

export function isValidArray<T>(v: unknown): v is Array<T>{
  return Array.isArray(v) && v.length > 0
}

export function checkPromise<T>(p: unknown, message = 'need a Promise instance'){
  if(p instanceof Promise) return p as Promise<T>

  return Promise.reject(message)
}

export function flat<T>(arr: T[]): T[]{
  if(!Array.isArray(arr)) return []

  return arr.reduce((acc, val) => acc.concat(val), [])
}

export function ignoreError(v: unknown): void{
  if(v instanceof Promise) {
    v.catch(e => __IS_DEV__ && console.error(e))
    return
  }

  if(isFunction(v)){
    try {
      return ignoreError(v())
    } catch (e) {
      __IS_DEV__ && console.error(e)
      return
    }
  }
}

export function parseMessage(v: unknown): string{
  if(null == v) return null
  if(v instanceof Error) return v.message
  if(isString(v)) return v
  if(isPlainObject<any>(v) && 'message' in v) return v.message
  if(isFunction(v.toString)) return v.toString()
  return null
}

function genRDS(length: number): string{
  const r = Math.random().toString(36).slice(2)
  if(r.length >= length) return r

  return r + genRandomStr(length - r.length)
}

export function genRandomStr(length = 8){
  return genRDS(length).slice(0, length)
}

export function toFunction<T extends Function>(v: unknown){
  return (isFunction(v) ? v : null) as any as T
}

export function getRaw<T>(v: unknown){
  if(isRef(v)) return v.value as T
  if(isReactive(v)) return toRaw(v) as T
  return v as T
}

export function usePrivateProps<P extends object>(){
  const storage = new WeakMap<any, P>()
  const o = Object.create(null)

  o.get = function(target: any, key: string){
    const raw = getRaw<any>(target)
    const props = storage.get(raw)
    if(isNull(props)) return null

    return Reflect.get(props, key, props)
  }

  o.set = function(target: any, key: string, value: any){
    const raw = getRaw<any>(target)
    const props = storage.get(raw)
    if(isNull(props)) return

    Reflect.set(props, key, value, props)
  }

  o.create = function(target: any, props: P){
    const raw = getRaw<any>(target)
    const old = storage.get(raw)
    storage.set(raw, { ...old, ...props })
  }

  __IS_DEV__ && (o.storage = storage)

  return o as {
    get: <V>(target: any, key: string) => V,
    set: (target: any, key: string, value: any) => void,
    create: (target: any, props: P) => void
  }
}

export function mixinRestParams(target: AnyProps, origin: AnyProps){
  if(target == null || origin == null) return

  Object.keys(origin).forEach(key => {
    if(!(key in target)) target[key] = origin[key]
  })
}

export function isRaw(value: object){
  return (value as any)['__v_skip'] === true
}

const PRIV_SYMBOL = __IS_DEV__ ? Symbol('private props') : Symbol()
export function createPrivateProps<T>(instance: any, pkey: Symbol, props: T){
  Reflect.defineProperty(instance, PRIV_SYMBOL, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function(this: object, key: Symbol){
      if(key !== pkey) {
        const name = this?.constructor?.name
        const prefix = name ? `${name}.` : ''
        
        throw new Error(`\`${prefix}props\` is a private function.`)
      }

      return props
    }
  })
}

export function getPrivateProps<T>(instance: any, pkey: Symbol){
  const fn = Reflect.get(instance, PRIV_SYMBOL)
  return isFunction(fn) ? fn(pkey) as T : null
}

export function freeze<T, P extends boolean>(object: T, deep?: P): P extends true ? DeepReadonly<T> : Readonly<T>{
  const o = object as any
  if(null == o || typeof o != 'object') return o
  if(deep === true) Reflect.ownKeys(o).forEach(key => freeze(o[key], deep))
  return Object.freeze(object) as any
}