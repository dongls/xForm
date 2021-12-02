import { Button, genEventName } from '@dongls/xform'

import IconTrash from '!!raw-loader!@common/svg/trash.svg'
import { nextTick } from 'vue'

const EVENT_CLEAR = 'clear'

export const BUTTON_CLEAR: Button = {
  icon: IconTrash,
  title: '清空',
  handle(field, api, instance){
    const name = genEventName(EVENT_CLEAR)
    const listener = instance.vnode?.props?.[name]
    const useDefault = function(){
      const rfs = field.fields.filter(f => f.allowRemove !== false)
      
      for(const f of rfs){
        field.remove(f)
        
        nextTick(() => {
          const hook = field.conf?.onRemoved
          if(typeof hook == 'function'){
            hook(f, field, instance) 
          }
        })
      }
      
      api.updateSchema()
    }

    typeof listener == 'function' ? instance.emit(EVENT_CLEAR, { field, useDefault }): useDefault()
  }
}