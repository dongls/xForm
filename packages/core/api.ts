import { 
  ComponentInternalInstance,
  onMounted,
  onBeforeUnmount,
  inject
} from 'vue'

import {
  dispatchEvent,
  EVENT_XFORM_FIELD_ADD,
  EVENT_XFORM_FIELD_REMOVE,
  EVENT_XFORM_VALIDATE
} from './util/event'

import { findComponentElement } from './util/component'
import { FieldAddEventDetail, FieldEventDetail, XFormModel } from './model'
import { XFORM_MODEL_SYMBOL } from '@core/model/constant'

export function useModel(){
  return inject(XFORM_MODEL_SYMBOL) as XFormModel
}

/** 注册字段 */
export function useField(component: ComponentInternalInstance, detail: FieldAddEventDetail){
  if(null == component) throw new Error('请传入组件实例')

  onMounted(() => {
    const element = findComponentElement(component)
    dispatchEvent(element, EVENT_XFORM_FIELD_ADD, detail, true)
  })

  onBeforeUnmount(() => {
    const element = findComponentElement(component)
    dispatchEvent(element, EVENT_XFORM_FIELD_REMOVE, { key: detail.key } as FieldEventDetail)
  })
  
  return {
    triggerValidate(){
      const element = findComponentElement(component)
      dispatchEvent(element, EVENT_XFORM_VALIDATE)
    }
  }
}
