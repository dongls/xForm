import { notNull } from '../../util/lang'
import { FormField, FormFieldLogic } from '../../model/FormField'
import { FieldLogic } from '../../model/Field'
import { store } from '../Store'

export function registerLogic(logic: FieldLogic){
  store.logic.set(logic.type, logic)
}

export function removeLogic(logic: string | FieldLogic){
  const type = typeof logic == 'string' ? logic : logic.type
  const exist = store.logic.get(type)

  if(typeof logic == 'string'){
    store.logic.delete(type)
    return exist
  }

  if(exist == logic){
    store.fields.delete(type)
    return exist
  }

  return null
}

export function resetLogic(){
  store.logic.clear()
}

export function getLogic(type: string){
  return store.logic.get(type)
}

export function getLogics(types: null | string[]){
  if(types == null) return Array.from(store.logic.values()).sort((a, b) => {
    const ao = a.order ?? 0
    const bo = b.order ?? 0
    return ao - bo
  })

  return types.map(key => store.logic.get(key)).filter(notNull)
}

export function getComposedLogic(){
  return Array.from(store.logic.values()).filter(l => l.composed === true)
}

// TODO: 判断字段位置, 只接收filed一个单数，不再接收model
export function test(fieldLogic: FormFieldLogic, field: FormField){
  if(null == fieldLogic) return true

  const logic = getLogic(fieldLogic.type)
  if(null == logic) return false

  return typeof logic.test == 'function' ? logic.test(fieldLogic, field) : false
}