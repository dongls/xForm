import { nextTick } from 'vue'

import { EVENTS, SELECTOR } from './constant'
import { genEventName } from '../util/component'
import { isFunction } from '../util/lang'
import { getField } from '../util/dom'

import { Button } from './common'
import { IconClone, IconRemove, IconPickUp } from '@common/svg/raw'

export const BUTTON_COPY: Button = {
  icon: IconClone,
  title: '复制',
  handle(field, api){
    if(field.allowClone === false) return

    const scope = field.parent
    const newField = field.clone()
    scope.insert(scope.indexOf(field) + 1, newField)
    api.updateSchema()
    api.chooseField(newField)
  }
}

export const BUTTON_REMOVE: Button = {
  icon: IconRemove,
  title: '删除',
  handle(field, api, instance){
    if(field.allowRemove === false) return

    const name = genEventName(EVENTS.REMOVE)
    const listener = instance.vnode?.props?.[name]
    const useDefault = function(){
      const scope = field.parent
      scope.remove(field)
      api.chooseField(null)
      api.updateSchema()

      nextTick(() => {
        // TODO: 是否从`scope.remove`方法中触发
        const hook = field.conf?.onRemoved
        isFunction(hook) && hook(field, scope, instance) 
      })
    }
    
    isFunction(listener) ? instance.emit(EVENTS.REMOVE, { field, useDefault }): useDefault()
  }
}

export const BUTTON_PICK_UP: Button = {
  icon: IconPickUp,
  title: '选中上一级',
  handle(field, api, instance, event){
    const target = event.target as HTMLElement
    const draggableEl = target.closest(SELECTOR.DRAGGABLE)
    if(draggableEl == null) return

    const parentEl = draggableEl.parentElement?.closest(SELECTOR.DRAGGABLE)
    if(parentEl == null) return

    const parent = getField(parentEl)
    if(parent == null) return

    api.chooseField(parent)
  }
}