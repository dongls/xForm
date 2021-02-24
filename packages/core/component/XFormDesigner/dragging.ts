import { 
  getCurrentInstance,
  onMounted, 
  onUnmounted 
} from 'vue'

import { 
  CLASS,
  EnumDragDirection,
  InternalDragContext,
  InternalDragUtils,
  PROPS, 
  SELECTOR, 
  XField, 
  XFormSchema,
  XFormScope,
} from '@model'

import { XFormDesignerInstance } from './component'
import { findElementsFromPoint, getProperty } from '@core/util/dom'
import { getHtmlElement } from '@core/util/component'
import store from '@core/store'

export default function useDragging(){
  const utils = {
    getInternalInstance,
    getPublicInstance,
    resetDragStatus,
    getMarkEl,
    moveMarkEl,
    getRootScopeEl,
    moveField
  } as InternalDragUtils

  const GLOBAL = {
    instance: getCurrentInstance(),
    context: null as InternalDragContext,
  }

  function getInternalInstance(){
    return GLOBAL.instance
  }

  function getPublicInstance(){
    return GLOBAL.instance.proxy as XFormDesignerInstance
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
        const tip = scope.querySelector(SELECTOR.IS_EMPTY_TIP)
        scope.insertBefore(mark, tip)
      }
      return
    }
  
    const reference = direction == EnumDragDirection.UP ? target : target.nextElementSibling
    if(
      reference == mark || 
      (null != reference && reference.previousElementSibling == mark)
    ) return
  
    if(null == reference) {
      scope.appendChild(mark)
      return
    }
  
    scope.insertBefore(mark, reference)
  }

  function resetDragStatus(){
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

  /** 
   * 移动字段位置
   * @param {number} a - 原位置
   * @param {number} b - 新位置
   * @param {XField[]} fields - 待排序的字段
   */
  function moveField(a: number, b: number, fields: XField[]){
    if(a < 0 || b < 0 || a == b) return

    const i = b > a ? b - 1 : b
    if(a == i) return

    const item = fields.splice(a, 1)[0]
    fields.splice(i, 0, item)
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
      return
    }

    ghost.classList.remove(CLASS.GHOST_NOT_ALLOW)

    // 触发dragover事件
    const dragOverEvent = context.createDragOverEvent(path, event, { ...utils })
    context.trigger(dragOverEvent)
    if(dragOverEvent.defaultPrevented) return

    const list = getHtmlElement(instance.refs, 'list')
    moveMarkEl(context.directionY, path[0], list, mark)
  }

  function dragend(event: MouseEvent){
    const { instance, context } = GLOBAL

    const mark = getHtmlElement(instance.refs, 'mark')
    const root = getHtmlElement(instance.refs, 'root')

    const path = findDropPath(mark, root)
    const dropEvent = context.createDropEvent(path, event, { ...utils })
    context.trigger(dropEvent)
    if(dropEvent.defaultPrevented) return

    const schema = instance.props.schema as XFormSchema
    const list = getHtmlElement(instance.refs, 'list') 
    const pInstance = getPublicInstance()
    const newIndex = context.isImmediateInsert ? -1 : Array.prototype.indexOf.call(list.children, mark)
    if(newIndex < 0) return resetDragStatus()

    // 新插入
    if(context.isInsert){
      const fc = store.findFieldConf(context.fieldType)
      if(null != fc){
        const field = new XField(fc)
        schema.fields.splice(newIndex, 0, field)
        pInstance.updateSchema()
        pInstance.chooseField(field)
      }

      return resetDragStatus()
    }

    // 原有字段重新排序
    if(context.isSort){
      const originScopeEl = context.dragElement.parentElement.closest(SELECTOR.SCOPE) ?? list
      const targetScopeEl = mark.closest(SELECTOR.SCOPE) ?? list
      const field = context.field

      if(originScopeEl == targetScopeEl){
        const scope = getProperty<XFormScope>(originScopeEl, PROPS.SCOPE)
        const oldIndex = scope.fields.indexOf(field)
        moveField(oldIndex, newIndex, scope.fields)
      } else {
        const oldScope = getProperty<XFormScope>(originScopeEl, PROPS.SCOPE)
        const newScope = getProperty<XFormScope>(targetScopeEl, PROPS.SCOPE)

        const oldIndex = oldScope.fields.indexOf(field)
        oldScope.fields.splice(oldIndex, 1)
        newScope.fields.splice(newIndex, 0, field)
      }
      pInstance.updateSchema()
      pInstance.chooseField(field)
      return resetDragStatus()
    }

    resetDragStatus()
  }

  onMounted(() => {
    document.addEventListener('mousedown', dragstart)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', dragstart)
  })
}