import { onBeforeUnmount, Ref, watch } from 'vue'
import { isFunction } from '../util/lang'
import { 
  Action,
  FormField,
  FormSchema,
  FormScope,
  LogicRule
} from '../model'

import './builtin'

export { test, getOperator, getOperators } from './operator'

function cleanRule(logic: LogicRule, target: FormField, acc: string[], scope: FormField | LogicRule){
  const condition = logic.condition
  if(Array.isArray(condition) && condition.length > 0) {
    condition.forEach(r => cleanRule(r, target, acc, logic))
    return
  }

  if(logic.name == target.name){
    if(scope instanceof FormField){
      scope.logic = null
    } else {
      const index = scope.condition.indexOf(logic)
      scope.condition.splice(index, 1)
    }
    
    const data = JSON.parse(JSON.stringify(logic))
    data.label = target.title
    acc.push(data)
  }
}

export function clean(scope: FormScope, field: FormField): string[]{
  if(field.logic == null) return []

  const current = scope.indexOf(field)
  return scope.fields.reduce((acc, f: FormField, index: number) => {
    if(current > index || field == f || field.logic == null) return acc
    cleanRule(field.logic, f, acc, field)
    return acc
  }, [])
}

export function useLogic(schemaRef: Ref<FormSchema>, onMessage: Function){
  const stopMap = new WeakMap<FormSchema, Function>()

  function cleanLogic(scope: FormScope, field: FormField){
    const data = clean(scope, field)
    if(data.length > 0) {
      onMessage({ type: 'logic.change', title: '字段逻辑发生变更', data, field })
    }
  }

  function effect(action: Action){
    switch(action.type){
      case 'field.move': {
        const field = action.field
        const scope = action.field.parent
        cleanLogic(scope, field)
        break
      }
      case 'field.remove': {
        const field = action.field
        const scope = action.oldParent
        cleanLogic(scope, field)
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

  const watchStop = watch(schemaRef, (newSchema, oldSchema) => {
    stop(oldSchema)
    use(newSchema)    
  })

  use(schemaRef.value)
  onBeforeUnmount(() => {
    stop()
    watchStop()
  })

  return { clean }
}