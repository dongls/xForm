import Store from '@core/store'

import { ComponentInternalInstance } from 'vue'

import { findElementFromPoint } from '@core/util/dom'
import { findComponentElement } from '@core/util/component'

import { 
  XField, 
  DragEvent, 
  DragContext, 
  DragModeEnum,
  XFormSchema,
  CLASS,
  MATCH_PATHS,
  SELECTOR
} from '@core/model'

function checkMode(mode: string){
  return mode == 'insert' || mode == 'sort'
}

function createDragEvent(event: MouseEvent, mode: DragModeEnum, field?: XField){
  const el = event.target as HTMLElement
  const target = el.closest('.xform-draggable') as HTMLElement
  const rect = target.getBoundingClientRect()

  return {
    init: false,
    mode, 
    target, // 拖拽的dom元素
    field, // 排序用
    prevClientY: event.clientY,
    offsetLeft: mode == 'insert' ? event.clientX - rect.left : 72,
    offsetTop: mode == 'insert' ? event.clientY - rect.top : 17
  } as DragEvent
}

function genGhostHtml(dragEvent: DragEvent, scope: HTMLElement){
  const target = dragEvent.target
  if(dragEvent.mode == 'insert'){
    return target.matches('.xform-template') ? target.outerHTML : target.querySelector('.xform-template').outerHTML
  }

  const field = dragEvent.field
  const element = scope.querySelector(`.xform-designer-field[data-field="${field.type}"]`)
  if(null == element) return `
    <div class="xform-designer-field">
      <strong>${field.title}</strong>
    </div>
  `

  return element.outerHTML.replace(/<strong>(.*)<\/strong>/, `<strong>${field.title}</strong>`)
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

export default function useDragging(instance: ComponentInternalInstance, schema: XFormSchema, chooseField: Function){
  const context = {} as DragContext

  function dragging(event: MouseEvent){
    const dragEvent = context.dragEvent
    const ghostEl = instance.refs.ghost as HTMLElement
    const listEl = instance.refs.list as HTMLElement
    const markEl = instance.refs.mark as HTMLElement
    const zoneEl = instance.refs.zone as HTMLElement

    // 初始化拖拽样式
    if(!dragEvent.init){
      listEl.classList.add(CLASS.LIST_SILENCE)
      
      ghostEl.querySelector(SELECTOR.GHOST_TEMPLATE).innerHTML = genGhostHtml(dragEvent, findComponentElement(instance))
      ghostEl.style.display = 'block'
      
      if(dragEvent.mode == 'sort') dragEvent.target.classList.add(CLASS.IS_DRAGGING)
      
      dragEvent.init = true
    }
  
    // 移动ghost
    const left = event.clientX - dragEvent.offsetLeft
    const top = event.clientY - dragEvent.offsetTop
    ghostEl.style.transform = `translate(${left}px, ${top}px)`
    
    // 移动距离小于1,不触发计算
    if(Math.abs(event.clientY - dragEvent.prevClientY) < 2) return
  
    const direction = event.clientY - dragEvent.prevClientY < 0 ? 'up' : 'down'
    dragEvent.prevClientY = event.clientY
  
    // 判断是否有可插入的节点
    const target = findElementFromPoint(event.clientX, event.clientY, MATCH_PATHS)
    
    // 如果target为null说明在容器外
    if(null == target){
      zoneEl.appendChild(markEl)
      return ghostEl.classList.add(CLASS.GHOST_NOT_ALLOW)
    }
  
    ghostEl.classList.remove(CLASS.GHOST_NOT_ALLOW)
    
    // target为zoneEl
    if(target == zoneEl) return !listEl.contains(markEl) && listEl.appendChild(markEl)
    // target为listEL
    if(target == listEl) return
  
    const referenceEl = direction == 'up' ? target : target.nextElementSibling
    if(referenceEl == markEl || (null != referenceEl && referenceEl.previousElementSibling == markEl)) return
  
    listEl.insertBefore(markEl, referenceEl)
  }
  
  function dragend(event: MouseEvent){
    const dragEvent = context.dragEvent
    const ghostEl = instance.refs.ghost as HTMLElement
    const listEL = instance.refs.list as HTMLElement
    const markEl = instance.refs.mark as HTMLElement
    const zoneEl = instance.refs.zone as HTMLElement

    const newIndex = (
      dragEvent.mode == 'insert' && !dragEvent.init
        ? schema.fields.length
        : Array.from(listEL.children).findIndex(item => item == markEl)
    )
  
    if(newIndex >= 0){
      if(dragEvent.mode == 'sort'){
        const field = dragEvent.field
        const oldIndex = schema.fields.indexOf(field)

        sort(oldIndex, newIndex, schema.fields)
        instance.emit('update:schema', schema)

        chooseField(field)
      }
  
      if(dragEvent.mode == 'insert'){
        const fieldConf = Store.findFieldConf(dragEvent.target.dataset.field)
        if(null != fieldConf) {
          const field = new XField(fieldConf)
          schema.fields.splice(newIndex, 0, field)
          instance.emit('update:schema', schema)

          chooseField(field)
        }
      }
    }
  
    dragEvent.target.classList.remove(CLASS.IS_DRAGGING)
    
    listEL.classList.remove(CLASS.LIST_SILENCE)
    zoneEl.appendChild(markEl)
    ghostEl.style.display = 'none'
    context.dragEvent = null
  
    // 清空鼠标事件
    document.removeEventListener('mousemove', dragging)
    document.removeEventListener('mouseup', dragend)
  }

  function dragstart(event: MouseEvent, mode: DragModeEnum, field?: XField){
    // 屏蔽非鼠标左键的点击事件
    if(event.button !== 0 || !checkMode(mode)) return
    
    const dragEvent = createDragEvent(event, mode, field)

    context.dragEvent = dragEvent
    // 监听鼠标移动事件
    document.addEventListener('mousemove', dragging)
    document.addEventListener('mouseup', dragend)
  }

  return { dragstart }
}