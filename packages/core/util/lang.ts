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
export function isPlainObject(value: unknown) {
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

export function checkPromise(p: unknown, message = 'need a Promise instance'){
  if(p instanceof Promise) return p

  return Promise.reject(message)
}