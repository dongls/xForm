import { nextTick } from 'vue'

import { EVENTS } from './constant'
import { genEventName } from '../util/component'
import { isFunction } from '../util/lang'
import { Button } from './common'

import IconClone from '!!raw-loader!@common/svg/clone.svg'
import IconRemove from '!!raw-loader!@common/svg/remove.svg'

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
        const hook = field.conf?.onRemoved
        isFunction(hook) && hook(field, scope, instance) 
      })
    }
    
    isFunction(listener) ? instance.emit(EVENTS.REMOVE, { field, useDefault }): useDefault()
  }
}