import { ComponentInternalInstance } from 'vue'
import { DragModeEnum, DirectionEnum, SELECTOR, ATTRS, CLASS } from './constant'
import { XFormSchema } from './common'
import XField from './XField'

export interface DragContext {  
  schema: XFormSchema;
  instance: ComponentInternalInstance;

  rootEl: HTMLElement;
  ghostEl: HTMLElement;
  listEl: HTMLElement;
  markEl: HTMLElement;
  zoneEl: HTMLElement;

  chooseField: Function;
  clearDragStatus: Function;
  findElementFromPoint: Function;
  moveMarkEl: Function;
  sort: Function;
  triggerUpdateSchema: Function;
}

export class DragEvent{
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
  // 字段类型
  fieldType: string; 
  // 字段
  field?: XField;
  // 上一位置的y坐标
  clientY: number;
  // ghostEl左边与鼠标之间的偏移量
  offsetLeft: number;
  // ghostEl上边与鼠标之间的偏移量
  offsetTop: number;
  
  constructor(event: MouseEvent, mode: DragModeEnum, field: XField){
    const target = (event.target as Element).closest(SELECTOR.DRAGGABLE)
    const rect = target.getBoundingClientRect()

    this.mode = mode
    this.fieldType = target.getAttribute(ATTRS.XFIELD_TYPE)
    this.field = field
    this.target = target
    this.clientY = event.clientY
    this.offsetLeft = mode == DragModeEnum.INSERT ? event.clientX - rect.left : 72
    this.offsetTop = mode == DragModeEnum.INSERT ? event.clientY - rect.top : 17
  }

  initialize(context: DragContext){
    const template = context.ghostEl.querySelector(SELECTOR.GHOST_TEMPLATE)

    context.ghostEl.classList.add(CLASS.IS_SHOW)
    context.listEl.classList.add(CLASS.LIST_SILENCE)
    template.innerHTML = this.createGhost(context.rootEl)
  
    if(this.mode == DragModeEnum.INSERT) {
      this.target.classList.add(CLASS.IS_DRAGGING)
    }
    
    this.init = true  
  }

  private createGhost(scope: HTMLElement){
    if(this.mode == 'insert'){
      return (
        this.target.matches(SELECTOR.TEMPLATE)
          ? this.target.outerHTML 
          : this.target.querySelector(SELECTOR.TEMPLATE).outerHTML
      )
    }
  
    const field = this.field
    const selector = `${SELECTOR.FIELD}[${ATTRS.XFIELD_TYPE}="${field.type}"]`
    const element = scope.querySelector(selector)
    if(null == element) return `
      <div class="xform-designer-field">
        <strong>${field.title}</strong>
      </div>
    `
    return element.outerHTML.replace(
      /<strong>(.*)<\/strong>/, 
      `<strong>${field.title}</strong>`
    )
  }
}