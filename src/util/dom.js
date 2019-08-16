/**
* 判断元素是否不可见
* @param {HTMLElement} el - 待判断的元素
* @param {HTMLElement} container - 容器
* @returns {boolean} 不可见返回true
*/
export function isHidden(el, container){
  return (
    el.offsetTop < container.scrollTop ||
    el.offsetTop > container.scrollTop + container.offsetHeight
  )
}

/**
 * 查找左边点下第一个符合的元素
 * @param {number} x - 坐标点的水平坐标值
 * @param {number} y - 坐标点的垂向坐标值
 * @param {string[]} selectors - 目标选择器
 * @returns {HTMLElement | null} 
 */
export function findElementFromPoint(x, y, selectors){
  const elementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint;
  if(typeof elementsFromPoint !== 'function') return null;

  const result = elementsFromPoint.call(document, x, y);
  if(null == result) return null;

  const elements = Array.isArray(result) ? result : Array.prototype.slice.call(result);
  
  for(let i = 0; i < elements.length; i++){
    const element = elements[i]
    if(selectors.some(selector => element.matches(selector))) return element;
  }

  return null;
}

/**
 * 统一浏览器之间wheel事件的差异
 * @see https://github.com/basilfx/normalize-wheel
 * @param {Event} event - 事件对象
 */
export function normalizeWheel(event){
  const {deltaX, deltaY} = event;
  const unit = event.deltaMode == 0 ? 1 : event.deltaMode == 1 ? 40 : 800;

  return {pixelX: deltaX * unit, pixelY: deltaY * unit};
}
