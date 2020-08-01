import Store from '@core/store'

import { ComponentInternalInstance, onMounted } from 'vue'
import { findElementFromPoint, findHookEl } from '@core/util/dom'

import { 
  ATTRS,
  CLASS,
  DirectionEnum,
  DragContext,
  DragEvent,
  DragModeEnum,
  MATCH_PATHS,
  SELECTOR,
  XField, 
  XFormSchema,
} from '@core/model'

function checkMode(mode: string){
  return mode == DragModeEnum.INSERT || mode == DragModeEnum.SORT
}

/** 
 * 拖拽排序
 * @param {number} a - 原位置
 * @param {number} b - 新位置
 * @param {XField[]} fields - 待排序的字段
 */
function sort(a: number, b: number, fields: XField[]){
  if(a < 0 || b < 0 || a == b) return
  const item = fields.splice(a, 1)[0]
  fields.splice(b > a ? b - 1 : b, 0, item)
}

/** 移动标记 */
function moveMarkEl(direction: string, target: Element, mark: Element, list: Element, scope: Element){  
  // target为scope或list时，将mark插入List
  if(target == scope || target == list) {
    if(!list.contains(mark)) list.appendChild(mark)
    return
  }

  const reference = direction == 'up' ? target : target.nextElementSibling
  if(
    reference == mark || 
    (null != reference && reference.previousElementSibling == mark)
  ) return

  reference ? list.insertBefore(mark, reference) : list.appendChild(mark)
}

export default function useDragging(
  instance: ComponentInternalInstance, 
  schema: XFormSchema, 
  chooseField: Function
){
  const GLOBAL = { 
    dragEvent: null as DragEvent,
    context: null as DragContext
  }

  function triggerUpdateSchema(){
    instance.emit('update:schema', schema)
  }

  // 重置拖拽状态
  function clearDragStatus(){
    const { dragEvent, context } = GLOBAL
    dragEvent.target.classList.remove(CLASS.IS_DRAGGING)
    context.listEl.classList.remove(CLASS.LIST_SILENCE)
    context.ghostEl.classList.remove(CLASS.IS_SHOW)
    context.zoneEl.appendChild(context.markEl)
    GLOBAL.dragEvent = null
  
    // 清空鼠标事件
    document.removeEventListener('mousemove', dragging)
    document.removeEventListener('mouseup', dragend)
  }

  onMounted(function() {    
    GLOBAL.context = Object.freeze({
      schema,
      instance,

      rootEl: instance.refs.designer as HTMLElement,
      ghostEl: instance.refs.ghost as HTMLElement,
      listEl: instance.refs.list as HTMLElement,
      markEl: instance.refs.mark as HTMLElement,
      zoneEl: instance.refs.zone as HTMLElement,

      chooseField,
      clearDragStatus,
      findElementFromPoint,
      moveMarkEl,
      sort,
      triggerUpdateSchema,
    }) as DragContext
  })

  function dragging(event: MouseEvent){
    const { dragEvent, context } = GLOBAL
    const ghostEl = context.ghostEl

    // 初始化拖拽样式
    if(!dragEvent.init) dragEvent.initialize(context)
  
    // 移动ghost
    const left = event.clientX - dragEvent.offsetLeft
    const top = event.clientY - dragEvent.offsetTop
    ghostEl.style.transform = `translate(${left}px, ${top}px)`
    
    // 移动距离小于2,不触发计算
    if(Math.abs(event.clientY - dragEvent.clientY) < 2) return
  
    dragEvent.direction = (
      event.clientY - dragEvent.clientY < 0 
        ? DirectionEnum.UP 
        : DirectionEnum.DOWN
    )
    dragEvent.clientY = event.clientY
  
    // 判断是否有可插入的节点
    const target = findElementFromPoint(event.clientX, event.clientY, MATCH_PATHS, context.rootEl)
    // 如果target为null说明在容器外
    if(null == target){
      context.zoneEl.appendChild(context.markEl)
      return ghostEl.classList.add(CLASS.GHOST_NOT_ALLOW)
    }
  
    ghostEl.classList.remove(CLASS.GHOST_NOT_ALLOW)
    
    // 查询需要触发hook的元素
    const hookEl = findHookEl(target)
    const fc = Store.findFieldConf(hookEl.getAttribute(ATTRS.XFIELD_TYPE))
    if(fc && typeof fc.onDragOver == 'function') {
      dragEvent.hookElement = hookEl
      // 阻止默认行为
      if(fc.onDragOver(event, dragEvent, context) !== false) return
    }

    moveMarkEl(dragEvent.direction, hookEl, context.markEl, context.listEl, context.zoneEl)
  }
  
  function dragend(event: MouseEvent){
    const { dragEvent, context } = GLOBAL
    const target = dragEvent.target
    const markEl = context.markEl
    const listEl = context.listEl

    const scopeEl = markEl.closest(SELECTOR.SCOPED)
    if(null != scopeEl){
      const fc = Store.findFieldConf(scopeEl.getAttribute(ATTRS.XFIELD_TYPE))
      if(fc && typeof fc.onDrop == 'function'){
        dragEvent.dropElement = scopeEl
        fc.onDrop(event, dragEvent, context)
        return clearDragStatus()
      }
    }

    const newIndex = (
      dragEvent.mode == 'insert' && !dragEvent.init
        ? schema.fields.length
        : Array.prototype.indexOf.call(listEl.children, markEl)
    )

    if(newIndex < 0) return clearDragStatus()

    if(dragEvent.mode == 'sort'){
      const target = dragEvent.target
      const scopeEl = target.closest(SELECTOR.SCOPED)
      const field = dragEvent.field
      
      if(null != scopeEl && scopeEl != target){
        const name = scopeEl.getAttribute(ATTRS.XFIELD_NAME)
        const scopedField = schema.fields.find(f => f.name == name)
        const oldIndex = scopedField.fields.indexOf(field)

        scopedField.fields.splice(oldIndex, 1)
        schema.fields.splice(newIndex, 0, field)
      } else {
        const oldIndex = schema.fields.indexOf(field)
        sort(oldIndex, newIndex, schema.fields)
      }
      
      triggerUpdateSchema()
      chooseField(field)
      return clearDragStatus()
    }

    if(dragEvent.mode == 'insert'){
      const type = target.getAttribute(ATTRS.XFIELD_TYPE)
      const fc = Store.findFieldConf(type)
      if(null != fc) {
        const field = new XField(fc)
        schema.fields.splice(newIndex, 0, field)
        instance.emit('update:schema', schema)

        chooseField(field)
        return clearDragStatus()
      }
    }
  }

  function dragstart(event: MouseEvent, mode: DragModeEnum, field?: XField){
    // 屏蔽非鼠标左键的点击事件
    if(event.button !== 0 || !checkMode(mode)) return
    
    GLOBAL.dragEvent = new DragEvent(event, mode, field)
    // 监听鼠标移动事件
    document.addEventListener('mousemove', dragging)
    document.addEventListener('mouseup', dragend)
  }

  return { dragstart }
}