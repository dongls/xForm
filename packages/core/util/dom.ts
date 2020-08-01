import { SELECTOR } from '@core/model'

/**
* 判断元素是否不可见
* @param {HTMLElement} el - 待判断的元素
* @param {HTMLElement} container - 容器
* @returns {boolean} 不可见返回true
*/
export function isHidden(el: HTMLElement, container: HTMLElement): boolean{
  return (
    el.offsetTop < container.scrollTop ||
    el.offsetTop > container.scrollTop + container.offsetHeight
  )
}

/**
 * 查找坐标点下第一个符合的元素
 * @param {number} x - 坐标点的水平坐标值
 * @param {number} y - 坐标点的垂向坐标值
 * @param {string[]} selectors - 目标选择器
 * @returns {Element | null} 
 */
export function findElementFromPoint(x: number, y: number, selectors: string[], scope: Element): Element | null{
  const elementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint
  if(typeof elementsFromPoint !== 'function') return null

  let elements: Element[] = elementsFromPoint.call(document, x, y)
  if(scope != null) elements = elements.filter(e => scope.contains(e))

  for(const element of elements){
    if(selectors.some(selector => element.matches(selector))) return element
  }

  return null
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


/**
 * 查询需要触发hook的元素
 * @param {Element} target - 目标元素 
 * @returns {Element} 如果目标元素位于单独的scope中，那么返回scope对应的元素，否则返回目标元素
 */
export function findHookEl(target: Element){
  const scoped = target.closest(SELECTOR.SCOPED)
  return scoped ? scoped : target
}
