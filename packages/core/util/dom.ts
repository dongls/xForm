import { 
  FormField,
  PROPS,
  FormScope
} from '../model'

import { isString } from './lang'

/**
* 判断元素是否不可见
* @param {HTMLElement} el - 待判断的元素
* @param {HTMLElement} container - 容器
* @returns {boolean} 不可见返回true
*/
export function isHidden(el: HTMLElement, container: HTMLElement){
  const tRect = el.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()
  const half = tRect.height / 2

  return tRect.bottom - half < cRect.top || tRect.top + half > cRect.bottom
}

/**
 * 查找坐标点下第一个符合的元素
 * @param {number} x - 坐标点的水平坐标值
 * @param {number} y - 坐标点的垂向坐标值
 * @param {string[]} selector - 目标选择器
 * @returns {Element | null} 
 */
export function findElementFromPoint(x: number, y: number, selector: string | string[], scope?: Element){
  const elementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint
  if(typeof elementsFromPoint !== 'function') return null

  const elements: Element[] = elementsFromPoint.call(document, x, y)  
  for(const element of elements){
    if(scope != null && !scope.contains(element)) continue
    if(isString(selector) && element.matches(selector)) return element
    if(Array.isArray(selector) && selector.some(selector => element.matches(selector))) return element
  }

  return null
}

/** 查询坐标点下符合条件的元素 */
export function findElementsFromPoint(x: number, y: number, selector: string | string[], scope?: Element){
  const elementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint
  if(typeof elementsFromPoint !== 'function') return null

  const elements: Element[] = elementsFromPoint.call(document, x, y)
  return elements.filter(element => {
    if(scope != null && !scope.contains(element)) return false
    if(isString(selector)) return element.matches(selector)
    if(Array.isArray(selector)) return selector.some(selector => element.matches(selector))
    return false
  })
}

/**
 * 统一浏览器之间wheel事件的差异
 * @see https://github.com/basilfx/normalize-wheel
 * @param {Event} event - 事件对象
 */
export function normalizeWheel(event: WheelEvent){
  const { deltaX, deltaY } = event
  const unit = event.deltaMode == 0 ? 1 : event.deltaMode == 1 ? 40 : 800

  return { pixelX: deltaX * unit, pixelY: deltaY * unit }
}

/** 获取dom元素上的属性 */
export function getProperty<T>(element: Element, key: string){
  return (element as any)[key] as T
}

/** 获取dom元素上绑定的XField字段值 */
export function getField(element: Element){
  return getProperty<FormField>(element, PROPS.FIELD)
}

/** 获取dom元素上绑定的scope */
export function getScope(element: Element){
  return getProperty<FormScope>(element, PROPS.SCOPE) ?? getProperty<FormScope>(element, PROPS.FIELD)
}