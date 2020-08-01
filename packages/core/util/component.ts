import { ComponentInternalInstance } from 'vue'
import { XField } from '@core/model'
import { ComponentEnum } from '@core/model/XFieldConf'

/** 获取组件的根节点。 如果是Fragment 返回第一个dom节点 */
export function findComponentElement(component: ComponentInternalInstance): HTMLElement{
  const subTree = component.subTree
  if(subTree.el instanceof HTMLElement) return subTree.el

  const children = subTree.children

  if(Array.isArray(children)){
    for(const c of children){
      const child = c as any
      if(null != child && typeof child == 'object' && child.el instanceof HTMLElement) return child.el
    }
  }
  
  return null
}

/** 生成VNodeProps里事件名 */
export function genEventName(name: string){
  return 'on' + name[0].toUpperCase() + name.slice(1)
}

/** 获取字段配置的组件 */
export function getFieldComponent(field: XField, target: ComponentEnum, mode?: string){
  const component = field.conf?.[target]
  return typeof component == 'function' ? component(field, mode) : component
}
 
/**
 * 生成提示信息
 * @param {XFiled} field - 字段对象
 * @returns {string}
 */
export function genPlaceholder(field: XField){
  if(null == field) return ''

  const prefix = field.required ? field.type == 'select' ? '[必选] ' : '[必填] ' : ''
  const placeholder = field.placeholder || ''
  return `${prefix}${placeholder}` || null
}