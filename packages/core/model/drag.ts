import { FormField } from './FormField'

import { ComponentInternalInstance } from 'vue'
import {
  CLASS,
  EnumDragDirection,
  EnumDragEventType,
  EnumDragHook,
  EnumDragMode,
  PROPS,
  SELECTOR,
} from './constant'

import {
  isEmpty,
  isFunction,
  getHtmlElement,
  getProperty,
  isString,
} from '../util'

import { FormDesignerApi } from '../component/FormDesigner/component'
import { AnyProps } from './common'

const DELTA_X = 72
const DELTA_Y = 17
const MODIFIABLE_KEY = ['currentTarget', 'cancelBubble', 'defaultPrevented']

export interface InternalDragUtils{
  getInternalInstance: () => ComponentInternalInstance;
  getApi: () => FormDesignerApi;
  resetDragStatus: () => void,
  getMarkEl: () => HTMLElement,
  getRootScopeEl: () => HTMLElement,
  moveMarkEl: (direction: number, target: Element, scope: Element, mark?: Element) => void
}

export interface InternalDragEventContext extends InternalDragUtils, AnyProps{
  directionY?: number;
  directionX?: number;
  mode?: EnumDragMode;
  hook?: EnumDragHook;
  field?: FormField;
  fieldType?: string;
}

class InternalDragEvent{
  cancelBubble = false // 是否被取消
  currentTarget: Element // 当前被触发事件的元素
  defaultPrevented = false // 是否阻止默认行为
  context: InternalDragEventContext
  dragElement: Element // 正在拖拽的元素
  originEvent: Event // 当前触发的原生事件
  path: Element[] // 事件路径
  target: Element // 当前触发事件的元素
  type: string // 事件类型

  constructor(type: string, path: Element[], dragElement: Element, originEvent: Event, context: InternalDragEventContext){
    this.dragElement = dragElement
    this.type = type
    this.path = path
    this.target = path[0]
    this.originEvent = originEvent
    this.context = context
  }

  stopPropagation(){
    this.cancelBubble = true
  }

  preventDefault(){
    this.defaultPrevented = true
  }
}

export type PublicDragEvent = { 
  readonly [P in Exclude<keyof InternalDragEvent, 'currentTarget' | 'cancelBubble' | 'defaultPrevented'>]: InternalDragEvent[P] 
} & { 
  currentTarget: Element,
  cancelBubble: boolean,
  defaultPrevented: boolean,
  readonly context: Readonly<InternalDragEventContext> 
}

export class InternalDragContext{
  clientX: number // 上一位置的x左边
  clientY: number // 上一位置的y坐标
  deltaX: number // ghostEl左边与鼠标之间的偏移量
  deltaY: number // ghostEl上边与鼠标之间的偏移量
  dragElement: Element // 拖拽的元素
  dropElement: Element // 拖放的目标元素
  field?: FormField // 字段
  fieldType: string // 字段类型
  init = false // 是否初始化
  mode: EnumDragMode // 拖拽模式
  directionY: number
  directionX: number

  constructor(event: MouseEvent, dragElement: Element) {
    const field = getProperty<FormField>(dragElement, PROPS.FIELD)
    const fieldType = field?.type ?? getProperty<string>(dragElement, PROPS.FIELD_TYPE)
    const mode = getProperty<string>(dragElement, PROPS.DRAG_MODE)

    const isFieldEl = dragElement.matches(SELECTOR.FIELD)
    const templateEl = (
      isFieldEl 
        ? dragElement 
        : document.querySelector(`${SELECTOR.FIELD}.xform-template-${fieldType}`) ?? document.querySelector(SELECTOR.FIELD)
    )
    const rect = templateEl ? templateEl.getBoundingClientRect() : null

    this.dragElement = dragElement
    this.field = field
    this.fieldType = fieldType
    this.mode = mode == EnumDragMode.INSERT ? EnumDragMode.INSERT : EnumDragMode.SORT
    this.deltaX = isFieldEl ? event.clientX - rect.left : rect ? rect.width / 2 : DELTA_X
    this.deltaY = isFieldEl ? event.clientY - rect.top : rect ? rect.height / 2 : DELTA_Y
  }

  get isInsert(){
    return this.mode == EnumDragMode.INSERT
  }

  get isSort(){
    return this.mode == EnumDragMode.SORT
  }

  get isImmediateInsert(){
    return this.isInsert && !this.init
  }

  move(event: MouseEvent, instance: ComponentInternalInstance){
    if(!this.init) this.initialize(instance)

    const left = event.clientX - this.deltaX
    const top = event.clientY - this.deltaY
    const ghost = getHtmlElement(instance.refs, 'ghost')
    ghost.style.transform = `translate(${left}px, ${top}px)`
    
    this.directionY = event.clientY < this.clientY ? EnumDragDirection.UP : EnumDragDirection.DOWN
    this.directionX = event.clientX < this.clientX ? EnumDragDirection.LEFT : EnumDragDirection.RIGHT
    this.clientY = event.clientY
    this.clientX = event.clientX
  }

  reset(instance: ComponentInternalInstance){
    const list = getHtmlElement(instance.refs, 'list')
    const ghost = getHtmlElement(instance.refs, 'ghost')
    const mark = getHtmlElement(instance.refs, 'mark')
    const root = getHtmlElement(instance.refs, 'root')

    list.classList.remove(CLASS.LIST_SILENCE)
    ghost.classList.remove(CLASS.IS_SHOW)
    root.appendChild(mark)

    this.dragElement.classList.remove(CLASS.IS_DRAGGING)
  }

  createDragOverEvent(path: Element[], originEvent: Event, context: InternalDragEventContext){
    context.directionY = this.directionY
    context.directionX = this.directionX
    context.mode = this.mode
    context.hook = EnumDragHook.DRAGOVER
    context.fieldType = this.fieldType

    const event = new InternalDragEvent(EnumDragEventType.DRAGOVER, path, this.dragElement, originEvent, context)
    return InternalDragContext.createPublicDragEvent(event)
  }

  createDropEvent(path: Element[], originEvent: Event, context: InternalDragEventContext){
    context.mode = this.mode
    context.hook = EnumDragHook.DROP
    context.field = this.field
    context.fieldType = this.fieldType

    const event = new InternalDragEvent(EnumDragEventType.DROP, path, this.dragElement, originEvent, context)
    return InternalDragContext.createPublicDragEvent(event)
  }

  trigger(event: PublicDragEvent){
    const hook = event.context.hook
    if(isEmpty(hook)) return

    const elements = event.path
    for(const element of elements){
      if(element == this.dragElement) continue

      const field = getProperty<FormField>(element, PROPS.FIELD)
      if(field == null || field.conf == null || !isFunction(field.conf[hook])) continue
      
      const fc = field.conf
      if(Array.isArray(fc.accept) && fc.accept.indexOf(event.context.fieldType) < 0) continue

      event.currentTarget = element
      fc[hook](event)

      if(event.cancelBubble) break
    }

    return event
  }

  static createPublicDragEvent(event: InternalDragEvent){
    Object.freeze(event.context)

    return new Proxy<PublicDragEvent>(event, {
      set(target, prop, value, receiver){
        if(isString(prop) && MODIFIABLE_KEY.indexOf(prop) >= 0){
          Reflect.set(target, prop, value, receiver)
        } else if (__IS_DEV__) {
          console.warn(`Set operation on key "${String(prop)}" failed: target is readonly.`, target)
        }
  
        return true
      },
      deleteProperty(target, prop) {
        if (__IS_DEV__) {
          console.warn(`Delete operation on key "${String(prop)}" failed: target is readonly.`, target)
        }

        return true
      }
    })
  }

  private initialize(instance: ComponentInternalInstance){
    const template = getHtmlElement(instance.refs, 'template')
    const ghost = getHtmlElement(instance.refs, 'ghost')
    const list = getHtmlElement(instance.refs, 'list')
    const root = getHtmlElement(instance.refs, 'root')

    template.innerHTML = this.createTemplate(root)
    ghost.classList.add(CLASS.IS_SHOW)
    list.classList.add(CLASS.LIST_SILENCE)
  
    if(this.mode == EnumDragMode.SORT) {
      this.dragElement.classList.add(CLASS.IS_DRAGGING)
    }

    this.init = true
  }

  private createTemplate(scope: Element){
    const ft = this.fieldType
    const field = this.field
    const element = scope.querySelector(`${SELECTOR.FIELD}.xform-template-${ft}`)
    if(null == element) return `<div class="${CLASS.FIELD}"><strong>${field?.title ?? '未知字段'}</strong></div>`
    
    return (
      field
        ? element.outerHTML.replace(
          /<strong>(.*)<\/strong>/, 
          `<strong>${field.title}</strong>`
        ) 
        : element.outerHTML
    ).replace(
      /class="([^"]*)"/, 
      `class="${CLASS.FIELD} xform-template-${ft}"`
    )
  }
}