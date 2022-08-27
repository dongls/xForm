import { 
  getCurrentInstance,
} from 'vue'

import { 
  CLASS,
  EnumDragDirection,
  InternalDragContext,
  InternalDragUtils,
  SELECTOR, 
  FormField,
  FormDesignerApi
} from '../../model'

import { 
  findElementsFromPoint,
  getHtmlElement,
  getScope,
  showSelectedField,
} from '../../util'

import { findField } from '../../api'

const SCROLL_PX = 5

function useScroll(){
  let requestID = null as number

  function doScroll(scroll: HTMLElement, c: number){
    const r = scroll.scrollTop + c * SCROLL_PX
    scroll.scrollTop = r

    if(r < 0 || r > scroll.scrollHeight - scroll.offsetHeight){
      requestID = null
      return
    }

    requestID = window.requestAnimationFrame(doScroll.bind(null, scroll, c))
  }

  function doHorizontalScroll(scroll: HTMLElement, c: number){
    const r = scroll.scrollLeft + c * SCROLL_PX
    scroll.scrollLeft = r

    if(r < 0 || r > scroll.scrollWidth - scroll.offsetWidth){
      requestID = null
      return
    }

    requestID = window.requestAnimationFrame(doHorizontalScroll.bind(null, scroll, c))
  }

  function horizontalScroll(event: MouseEvent, scroll: HTMLElement){
    if(scroll.scrollWidth <=  scroll.offsetWidth) return
    
    const rect = scroll.getBoundingClientRect()
    if(event.clientX < rect.left){
      return requestID == null && doHorizontalScroll(scroll, -1) 
    }

    if(event.clientX > rect.right){
      return requestID == null && doHorizontalScroll(scroll, 1) 
    }

    cancelAutoScrollIfNeed()
  }

  function autoScrollIfNeed(event: MouseEvent, scroll: HTMLElement){
    if(scroll == null) return
    if(scroll.matches(SELECTOR.IS_HORIZONTAL_SCROLL)) return horizontalScroll(event, scroll)
    
    if(scroll.scrollHeight <= scroll.offsetHeight) return

    const rect = scroll.getBoundingClientRect()    
    if(event.clientX < rect.left || event.clientX > rect.right) return cancelAutoScrollIfNeed()

    if(event.clientY < rect.top){
      return requestID == null && doScroll(scroll, -1) 
    }

    if(event.clientY > rect.bottom){
      return requestID == null && doScroll(scroll, 1) 
    }

    cancelAutoScrollIfNeed()
  }
 
  function cancelAutoScrollIfNeed(){
    if(requestID == null) return

    window.cancelAnimationFrame(requestID)
    requestID = null
  }

  return { autoScrollIfNeed, cancelAutoScrollIfNeed }
}

export default function useDragging(){
  const utils = {
    getInternalInstance,
    getApi,
    resetDragStatus,
    getMarkEl,
    moveMarkEl,
    getRootScopeEl,
  } as InternalDragUtils

  const GLOBAL = {
    instance: getCurrentInstance(),
    context: null as InternalDragContext,
  }

  const {
    autoScrollIfNeed,
    cancelAutoScrollIfNeed
  } = useScroll()

  function getInternalInstance(){
    return GLOBAL.instance
  }

  function getApi(){
    return GLOBAL.instance.exposed as FormDesignerApi
  }

  function getMarkEl(){
    return getHtmlElement(GLOBAL.instance.refs, 'mark')
  }

  function getRootScopeEl(){
    return getHtmlElement(GLOBAL.instance.refs, 'list')
  }

  function moveMarkEl(direction: number, target: Element, scope: Element, mark = getMarkEl()){ 
    if(target == scope) {
      if(Array.prototype.indexOf.call(scope.children, mark) < 0) {
        const tip = Array.prototype.find.call(scope.children, (e: Element) => e.matches(SELECTOR.IS_EMPTY_TIP))
        scope.insertBefore(mark, tip)
      }
      return
    }

    if(Array.prototype.indexOf.call(scope.children, target) < 0) return
  
    const reference = (direction == EnumDragDirection.UP || direction == EnumDragDirection.LEFT) ? target : target.nextElementSibling
    if(
      reference == mark || 
      (null != reference && reference.previousElementSibling == mark)
    ) return
     
    null == reference ? scope.appendChild(mark) : scope.insertBefore(mark, reference)
  }

  function resetDragStatus(silence = false){
    if(!silence) showSelectedField(GLOBAL.instance)
    GLOBAL.context.reset(GLOBAL.instance)
    GLOBAL.context = null

    document.removeEventListener('mousemove', dragging)
    document.removeEventListener('mouseup', dragend)
  }

  function findDropPath(element: Element, scope?: Element){
    if(!(element instanceof Element)) return []
    scope = scope instanceof Element ? scope : document.body
    
    const path = []
    let parent = element.parentElement
    while(parent != null && scope.contains(parent)){
      if(parent.matches(SELECTOR.DROPPABLE)){
        path.push(parent)
      }

      parent = parent.parentElement
    }

    return path
  }

  function dragstart(event: MouseEvent){
    // 屏蔽非鼠标左键的点击事件
    if(event.button !== 0) return
    
    // 检测目标是否可以拖动
    const dragElement = (event.target as Element).closest(SELECTOR.DRAGGABLE)
    if(null == dragElement) return

    // 保存当前环境
    GLOBAL.context = new InternalDragContext(event, dragElement)

    // 监听鼠标移动事件
    document.addEventListener('mousemove', dragging, { passive: true })
    document.addEventListener('mouseup', dragend)
  }

  function dragging(event: MouseEvent){
    const { context, instance } = GLOBAL

    // 按住150ms后触发移动
    if(event.timeStamp - context.timeStamp < 150) return
    context.move(event, instance)

    // 判断是否有可插入的节点
    const ghost = getHtmlElement(instance.refs, 'ghost')
    const root = getHtmlElement(instance.refs, 'root')
    const mark = getHtmlElement(instance.refs, 'mark')
    const path = findElementsFromPoint(event.clientX, event.clientY, SELECTOR.DROPPABLE, root)
    // 如果target为null说明在容器外
    if(null == path || path.length == 0){
      root.appendChild(mark)
      ghost.classList.add(CLASS.GHOST_NOT_ALLOW)      
      return autoScrollIfNeed(event, context.dragElement.closest(SELECTOR.IS_SCROLL))
    }

    cancelAutoScrollIfNeed()
    ghost.classList.remove(CLASS.GHOST_NOT_ALLOW)

    // 触发dragover事件
    const dragOverEvent = context.createDragOverEvent(path, event, { ...utils })
    if(context.trigger(dragOverEvent).defaultPrevented) return

    const list = getHtmlElement(instance.refs, 'list')
    moveMarkEl(context.directionY, path[0], list, mark)
  }

  function dragend(event: MouseEvent){
    cancelAutoScrollIfNeed()

    const { instance, context } = GLOBAL
    if(!context.init && !context.isImmediateInsert) return resetDragStatus(true)

    const mark = getHtmlElement(instance.refs, 'mark')
    const root = getHtmlElement(instance.refs, 'root')
    const path = findDropPath(mark, root)
    if(path.length == 0 && !context.isImmediateInsert) return resetDragStatus()

    // 触发drop事件
    const dropEvent = context.createDropEvent(path, event, { ...utils })
    if(context.trigger(dropEvent).defaultPrevented) return

    const api = getApi()
    const rootScopeEl = getRootScopeEl()
    const targetScopeEl = mark.closest(SELECTOR.SCOPE) ?? rootScopeEl
    const targetScope = getScope(targetScopeEl)
    
    // 新插入
    if(context.isInsert){
      const newIndex = (
        context.isImmediateInsert 
          ? targetScope.fields.length 
          : Array.prototype.indexOf.call(targetScopeEl.children, mark)
      )
      if(newIndex < 0) return resetDragStatus()

      const fc = findField(context.fieldType)
      if(null != fc){
        const field = new FormField(fc)
        targetScope.insert(newIndex, field)
        api.updateSchema()
        api.chooseField(field)
      }

      return resetDragStatus()
    }

    // 原有字段重新排序
    const originScope = context.field.parent
    if(context.isSort){
      const field = context.field
      const newIndex = Array.prototype.indexOf.call(targetScopeEl.children, mark)

      // 在同一作用域下
      if(originScope == targetScope){
        // 计算插入的位置
        // 需要注意这里目标位置是mark的位置, 需要换算成字段的位置
        const fieldIndex = targetScope.indexOf(field)
        const targetIndex = newIndex > fieldIndex ? newIndex - 1 : newIndex
        field.move(targetIndex)
      } else {
        originScope.remove(field)
        targetScope.insert(newIndex, field)
      }

      api.updateSchema()
      api.chooseField(field)
      return resetDragStatus()
    }

    resetDragStatus()
  }

  return { dragstart, cancelAutoScrollIfNeed }
}