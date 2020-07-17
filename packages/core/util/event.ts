export const EVENT_XFORM_FIELD_ADD = 'xform_field_add'
export const EVENT_XFORM_FIELD_REMOVE = 'xform_field_remove'
export const EVENT_XFORM_VALIDATE = 'xform_validate'

/**
 * 触发一个自定义事件
 * @param {HTMLElement} target - 待触发事件的元素
 * @param {string} name - 事件名 
 * @param {object} detail - 携带的数据 
 * @param {boolean} async - 是否异步触发
 */
export function dispatchEvent(target: HTMLElement, name: string, detail?: any, async = false){
  if(null == target) return
  
  const event = new CustomEvent(name, { detail, bubbles: true, cancelable: true })
  async ? setTimeout(() => target.dispatchEvent(event), 0) : target.dispatchEvent(event)
}