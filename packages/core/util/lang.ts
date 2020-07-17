const OBJECT_TO_STRING_TAG = {
  RegExp: '[object RegExp]'
}

/** 是否为空串或null */
export function isEmptyStr(value: any){
  return null == value || (typeof value == 'string' && value.length == 0)
}

export function isEmpty(value: any){
  return (
    isEmptyStr(value) || 
    ( typeof value == 'number' && (isNaN(value) || !isFinite(value)) )
  )
}

/** 是否为对象 */
export function isObject(value: any){
  return value != null && (typeof value == 'object' || typeof value == 'function')
}

/** 是否为正则表达式 */
export function isRegExp(value: any){
  return isObject(value) && Object.prototype.toString.call(value) == OBJECT_TO_STRING_TAG.RegExp
}

/**
 * 克隆简单对象
 * @param {object} target - 待克隆的对象
 * @returns 克隆后的对象
 */
export function clonePlainObject(target: any): any{
  // TODO: 对带原型数据的处理
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
    target[prop] = merge(typeof tarValue != 'object' ? {} : tarValue, value)
  }

  return target
}

/** 合并简单对象 */
export function mergePlainObject(...source: any[]): any{
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