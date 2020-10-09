import XField from './XField'

import { ComponentInternalInstance } from 'vue'
import { DragModeEnum, DirectionEnum, SELECTOR, ATTRS, CLASS } from './constant'
import { getHtmlElement } from '@core/util/component'

export interface GlobalDragContext {  
  instance: ComponentInternalInstance;

  chooseField: Function;
  resetStatus: Function;
  moveMark: Function;
  sort: Function;
  updateSchema: Function;
}

export class GlobalDragEvent{
  init = false;

  // 拖拽的元素
  target: Element;
  // 触发hook的元素
  hookElement: Element;
  // 拖放的目标元素
  dropElement: Element;
  // 拖拽模式: sort, insert
  mode: DragModeEnum;
  // 拖动的方向
  direction: DirectionEnum;
  // 上一位置的y坐标
  clientY: number;
  // ghostEl左边与鼠标之间的偏移量
  deltaX: number;
  // ghostEl上边与鼠标之间的偏移量
  deltaY: number;
  // 携带的数据
  data: {
    // 字段类型
    type: string;
     // 字段
    field?: XField;
  }
  // 当前触发的原生事件
  originEvent: Event;
  // 事件上下文
  context: GlobalDragContext;
  
  constructor(event: MouseEvent, mode: DragModeEnum, field: XField, context: GlobalDragContext){
    const target = (event.target as Element).closest(SELECTOR.DRAGGABLE)
    const rect = target.getBoundingClientRect()

    this.mode = mode
    this.target = target
    this.clientY = event.clientY
    this.deltaX = mode == DragModeEnum.INSERT ? event.clientX - rect.left : 72
    this.deltaY = mode == DragModeEnum.INSERT ? event.clientY - rect.top : 17

    this.data = { type: target.getAttribute(ATTRS.XFIELD_TYPE), field }
    
    this.originEvent = event
    this.context = context
  }

  /** 更新拖动方向 */
  updateDirection(y: number){
    const direction = y - this.clientY < 0 ? DirectionEnum.UP : DirectionEnum.DOWN
    
    this.direction = direction
    this.clientY = y
  }

  updateDragStatus(event: MouseEvent){
    if(!this.init) this.initDrag()

    const instance = this.context.instance
    const left = event.clientX - this.deltaX
    const top = event.clientY - this.deltaY
    const ghost = getHtmlElement(instance.refs, 'ghost')
    ghost.style.transform = `translate(${left}px, ${top}px)`

    this.setOriginEvent(event)
  }

  setOriginEvent(event: Event){
    this.originEvent = event
  }

  private initDrag(){
    const instance = this.context.instance
    const template = getHtmlElement(instance.refs, 'template')
    const ghost = getHtmlElement(instance.refs, 'ghost')
    const list = getHtmlElement(instance.refs, 'list')
    const root = getHtmlElement(instance.refs, 'root')

    template.innerHTML = this.createGhost(root)
    ghost.classList.add(CLASS.IS_SHOW)
    list.classList.add(CLASS.LIST_SILENCE)
  
    if(this.mode == DragModeEnum.INSERT) {
      this.target.classList.add(CLASS.IS_DRAGGING)
    }
    
    this.init = true
  }

  private createGhost(scope: Element){
    if(this.mode == 'insert'){
      return (
        this.target.matches(SELECTOR.TEMPLATE)
          ? this.target.outerHTML 
          : this.target.querySelector(SELECTOR.TEMPLATE).outerHTML
      )
    }

    const field = this.data.field
    const selector = `${SELECTOR.FIELD}[${ATTRS.XFIELD_TYPE}="${field.type}"]`
    const element = scope.querySelector(selector)
    if(null == element) return `<div class="xform-designer-field"><strong>${field.title}</strong></div>`
    
    return element.outerHTML.replace(
      /<strong>(.*)<\/strong>/, 
      `<strong>${field.title}</strong>`
    )
  }
}