import Store from '@core/store'

import { ComponentInternalInstance } from 'vue'
import { 
  findElementFromPoint, 
  findHookEl, 
  getXField 
} from '@core/util/dom'

import { 
  GlobalDragContext,
  InternalDragEvent,
  XField, 
  XFormSchema,
  ATTRS,
  CLASS,
  DirectionEnum,
  DragModeEnum,
  MATCH_PATHS,
  SELECTOR,
} from '@model'

import { getHtmlElement } from '@core/util/component'
import { XFormDesignerInstance } from './component'

function checkMode(mode: string){
  return mode == DragModeEnum.INSERT || mode == DragModeEnum.SORT
}

/** 
 * 移动字段位置
 * @param {number} a - 原位置
 * @param {number} b - 新位置
 * @param {XField[]} fields - 待排序的字段
 */
function moveField(a: number, b: number, fields: XField[]){
  if(a < 0 || b < 0 || a == b) return
  const item = fields.splice(a, 1)[0]
  fields.splice(b > a ? b - 1 : b, 0, item)
}

/** 移动标记 */
function moveMark(direction: string, target: Element, mark: Element, scope: Element){ 
  if(target == scope) {
    if(!scope.contains(mark)) scope.appendChild(mark)
    return
  }

  const reference = direction == DirectionEnum.UP ? target : target.nextElementSibling
  if(
    reference == mark || 
    (null != reference && reference.previousElementSibling == mark)
  ) return

  reference ? scope.insertBefore(mark, reference) : scope.appendChild(mark)
}

export default function useDragging(instance: ComponentInternalInstance){
  const GLOBAL = { 
    EVENT: null as InternalDragEvent,
    CONTEXT: Object.freeze({
      getInternalInstance,
      getPublicInstance,

      resetStatus,
      moveMark,
      moveField
    }) as GlobalDragContext
  }

  function getInternalInstance(){
    return instance
  }

  function getPublicInstance(){
    return instance.proxy as XFormDesignerInstance
  }

  // 重置拖拽状态
  function resetStatus(){
    const list = getHtmlElement(instance.refs, 'list')
    const ghost = getHtmlElement(instance.refs, 'ghost')
    const mark = getHtmlElement(instance.refs, 'mark')
    const root = getHtmlElement(instance.refs, 'root')

    list.classList.remove(CLASS.LIST_SILENCE)
    ghost.classList.remove(CLASS.IS_SHOW)
    root.appendChild(mark)

    GLOBAL.EVENT.target.classList.remove(CLASS.IS_DRAGGING)
    GLOBAL.EVENT = null
  
    // 清空鼠标事件
    document.removeEventListener('mousemove', dragging)
    document.removeEventListener('mouseup', dragend)
  }

  function dragstart(event: MouseEvent, mode: DragModeEnum, field?: XField){
    // 屏蔽非鼠标左键的点击事件
    if(event.button !== 0 || !checkMode(mode)) return
    
    GLOBAL.EVENT = new InternalDragEvent(event, mode, field,  GLOBAL.CONTEXT)
    // 监听鼠标移动事件
    document.addEventListener('mousemove', dragging)
    document.addEventListener('mouseup', dragend)
  }

  function dragging(event: MouseEvent){
    const EVENT = GLOBAL.EVENT
    if(EVENT == null) return

    // 更新拖拽状态
    EVENT.move(event)
    // 移动距离小于2,不触发计算
    if(Math.abs(event.clientY - EVENT.clientY) < 2) return
  
    EVENT.updateDirection(event.clientY)
    // 判断是否有可插入的节点
    const ghost = getHtmlElement(instance.refs, 'ghost')
    const root = getHtmlElement(instance.refs, 'root')
    const mark = getHtmlElement(instance.refs, 'mark')
    const target = findElementFromPoint(event.clientX, event.clientY, MATCH_PATHS, root)
    // 如果target为null说明在容器外
    if(null == target){
      root.appendChild(mark)
      ghost.classList.add(CLASS.GHOST_NOT_ALLOW)
      return
    }
  
    ghost.classList.remove(CLASS.GHOST_NOT_ALLOW)
    
    // 查询需要触发DragOver hook的元素
    const hookEl = findHookEl(target)
    const fc = getXField(hookEl)?.conf
    if(fc && typeof fc.onDragOver == 'function') {
      EVENT.hookElement = hookEl
      // 阻止默认行为
      if(fc.onDragOver(EVENT) !== false) return
    }

    const list = getHtmlElement(instance.refs, 'list')
    moveMark(EVENT.direction, hookEl, mark, list)
  }
  
  // TODO: 重构
  function dragend(event: MouseEvent){
    const EVENT = GLOBAL.EVENT
    EVENT.setOriginEvent(event)

    const target = EVENT.target
    const schema = instance.props.schema as XFormSchema
    const mark = getHtmlElement(instance.refs, 'mark')
    const list = getHtmlElement(instance.refs, 'list') 

    // 如果mark在某一scope内，触发对应元素的onDrop钩子
    const scopeEl = mark.closest(SELECTOR.SCOPE)
    if(null != scopeEl){
      const fc = getXField(scopeEl)?.conf
      if(fc && typeof fc.onDrop == 'function'){
        EVENT.dropElement = scopeEl
        fc.onDrop(EVENT)
        resetStatus()
        return
      }
    }

    const newIndex = (
      EVENT.mode == 'insert' && !EVENT.init
        ? schema.fields.length
        : Array.prototype.indexOf.call(list.children, mark)
    )
    if(newIndex < 0) return resetStatus()

    const pInstance = getPublicInstance()
    if(EVENT.mode == 'sort'){
      const field = EVENT.data.field
      const targetScopeEl = target.closest(SELECTOR.SCOPE)
      
      // 如果新位置在某一scope内
      if(null != targetScopeEl && target != targetScopeEl){
        const scope = getXField(targetScopeEl)
        const oldIndex = scope.fields.indexOf(field)

        scope.fields.splice(oldIndex, 1)
        schema.fields.splice(newIndex, 0, field)
      } else {
        const oldIndex = schema.fields.indexOf(field)
        moveField(oldIndex, newIndex, schema.fields)
      }
      
      pInstance.updateSchema()
      pInstance.chooseField(field)
      return resetStatus()
    }

    if(EVENT.mode == 'insert'){
      const type = target.getAttribute(ATTRS.XFIELD_TYPE)
      const fc = Store.findFieldConf(type)
      if(null != fc) {
        const field = new XField(fc)
        schema.fields.splice(newIndex, 0, field)

        pInstance.updateSchema()
        pInstance.chooseField(field)
        return resetStatus()
      }
    }
  }

  return { dragstart }
}