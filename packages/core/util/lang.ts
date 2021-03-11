import { isReactive, isRef, toRaw } from '@vue/reactivity'
import { AnyProps } from '../model'

const OBJECT_TO_STRING = Object.prototype.toString
const OBJECT_TO_STRING_TAG = {
  RegExp: '[object RegExp]'
}

function getObjectTag(value: unknown): string{
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

/** 是否为空串 */
export function isEmpty(value: unknown){
  return isString(value) && value.trim().length == 0 
}

export function isNumber(value: unknown): value is number{
  return typeof value === 'number'
}

export function isNull(value: unknown): value is null{
  return value == null
}

/** 是否为对象 */
export function isObject(value: unknown){
  return value != null && (typeof value == 'object' || typeof value == 'function')
}

/** 是否为正则表达式 */
export function isRegExp(value: unknown): value is RegExp{
  return isObject(value) && getObjectTag(value) == OBJECT_TO_STRING_TAG.RegExp
}

export function isFunction(value: unknown): value is Function{
  return typeof value == 'function'
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
  if(Array.isArray(target)) return target.map(clonePlainObject)
  
  const obj: any = {}
  for(const prop in target){
    // 只复制对象本身的属性，忽略原型上的属性
    if(!Object.prototype.hasOwnProperty.call(target, prop)) continue

    const value = target[prop]
    obj[prop] = (null == value || typeof target != 'object') ? value : clonePlainObject(value)
  }

  return obj
}

function merge(target: any, source: any){
  for(const prop in source){
    // 只合并对象本身的属性，忽略原型上的属性
    if(!Object.prototype.hasOwnProperty.call(source, prop) || null == source[prop]) continue

    const value = source[prop]
    // 数组和非object对象直接替换
    if(typeof value != 'object' || Array.isArray(value)){
      target[prop] = value
      continue
    }

    const tarValue = target[prop]
    target[prop] = merge(isObject(tarValue) ? tarValue : {}, value)
  }

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

export function toArray<T>(value: unknown){
  return (Array.isArray(value) ? value : []) as Array<T>
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
    v.catch(e => __IS_DEV__ && console.warn(e))
    return
  }

  if(isFunction(v)){
    try {
      return ignoreError(v())
    } catch (e) {
      __IS_DEV__ && console.warn(e)
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

export function usePrivateProps<T extends object, P extends object>(){
  const storage = new WeakMap<T, P>()
  const o = Object.create(null)

  o.get = function<V>(target: T, key: string){
    const raw = getRaw<T>(target)
    const props = storage.get(raw)
    if(isNull(props)) return null

    return Reflect.get(props, key, props) as V
  }

  o.set = function(target: T, key: string, value: any){
    const raw = getRaw<T>(target)
    const props = storage.get(raw)
    if(isNull(props)) return

    Reflect.set(props, key, value, props)
  }

  o.create = function(target: T, props: P){
    const raw = getRaw<T>(target)
    const old = storage.get(raw)
    storage.set(raw, { ...old, ...props })
  }

  __IS_DEV__ && (o.storage = storage)

  return o as {
    get: <V>(target: T, key: string) => V,
    set: (target: T, key: string, value: any) => void,
    create: (target: T, props: P) => void
  }
}

export function mixinRestParams(target: AnyProps, origin: AnyProps){
  if(target == null || origin == null) return

  Object.keys(origin).forEach(key => {
    if(!(key in target)) target[key] = origin[key]
  })
}