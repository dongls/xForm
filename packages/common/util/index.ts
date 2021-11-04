import { FormField, useConstant } from '@dongls/xform'
import { computed, getCurrentInstance, Ref, toRef } from 'vue'

const { EVENTS } = useConstant()

export function useField(){
  const instance = getCurrentInstance()
  return toRef(instance.props, 'field') as Ref<FormField>
}

export function useFieldProp<T>(prop: string, scope?: string, defaultValue?: any) {
  const instance = getCurrentInstance()

  return computed<T>({
    get(){
      const field = instance.props.field as FormField
      const value = scope ? field?.[scope]?.[prop] : field?.[prop]
      return value ?? defaultValue
    },
    set(v: any){
      const value = v == '' ? undefined : v
      instance.emit(EVENTS.UPDATE_FIELD, { prop, value, scope })
    }
  })
}

export function useValue<T>(defaultValue?: any){
  const fieldRef = useField()

  return computed<T>({
    get(){
      const field = fieldRef.value
      return field.value ?? defaultValue
    },
    set(v){
      const field = fieldRef.value
      field.value = v 
    }
  })
}