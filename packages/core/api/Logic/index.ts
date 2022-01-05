import { onBeforeUnmount, Ref, watch } from 'vue'

import { isFunction } from '../../util/lang'
import { FormField, FormFieldLogic } from '../../model/FormField'
import { FormSchema } from '../../model/FormSchema'
import { FormScope } from '../../model/FormScope'
import { Action } from '../../model/action'
import { useBuiltIn } from './builtin'

function isAffectedCondition(logic: FormFieldLogic, name: string): boolean{
  if(!logic.hasCondition) return false

  return logic.conditions.some(c => {
    if(c.field == name) return true

    return isAffectedCondition(c, name)
  })
}

function isAffectedField(current: FormField, target: FormField){
  const logic = current.logic

  if(logic == null) return false
  if(logic.field == target.name) return true

  return isAffectedCondition(logic, target.name)
}

function getAffectedFields(scope: FormScope, field: FormField, start?: number, end?: number): FormField[]{
  const index = scope.indexOf(field)
  const target = index >= 0 ? index : scope.fields.length + 1
  
  const r = scope.fields.reduce((acc, f: FormField, index: number) => {
    if(field == f || index < start || index > end) return acc

    const [p, n] = index < target ? [f, field] : [field, f]
    if(isAffectedField(p, n)) acc.add(p)
    
    return acc
  }, new Set<FormField>())

  return Array.from(r.values())
}

export function useCleanLogicIfNeed(schemaRef: Ref<FormSchema>, onMessage: (event: any) => void){
  const stopMap = new WeakMap<FormSchema, Function>()

  function onChange(action: any, scope: FormScope, field: FormField, start?: number, end?: number){
    const fields = getAffectedFields(scope, field, start, end)
    if(fields.length == 0) return

    onMessage({
      type: 'logic.change', 
      target: field,
      fields,
      action
    })
  }

  function effect(action: Action){
    switch(action.type){
      case 'field.move': {
        const field = action.field
        const scope = action.field.parent
        const p = action.oldIndex < action.newIndex ? [action.oldIndex, action.newIndex] : [action.newIndex, action.oldIndex]
        onChange(action, scope, field, p[0], p[1])
        break
      }
      case 'field.remove': {
        const field = action.field
        const scope = action.oldParent
        onChange(action, scope, field, 0, scope.fields.length - 1)
        break
      }
    }
  }

  function use(schema: FormSchema){
    const callback = schema.useEffect(effect)
    stopMap.set(schema, callback)
  }

  function stop(schema: FormSchema = schemaRef.value){
    const callback = stopMap.get(schema)
    if(isFunction(callback)) {
      callback()
      stopMap.delete(schema)
    }
  }

  const stopHandle = watch(schemaRef, (newSchema, oldSchema) => {
    stop(oldSchema)
    use(newSchema)    
  })

  use(schemaRef.value)
  onBeforeUnmount(() => {
    stop()
    stopHandle()
  })
}

useBuiltIn()

export { 
  BUILTIN_LOGIC_AND,
  BUILTIN_LOGIC_NOT,
  BUILTIN_LOGIC_OR,
} from './builtin'

export * from './logic'