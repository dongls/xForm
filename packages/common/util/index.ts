import { FormField, useConstant } from '@dongls/xform'
import { computed, getCurrentInstance, Ref, toRef } from 'vue'

const { EVENTS, BuiltInDefaultValueType } = useConstant()

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

export function useDefaultValueApi(defTypes: any[]){
  const defaultValue = useFieldProp<{type: string, value?: any}>('defaultValue')

  function useCompatType(){
    return computed({
      get(){
        const type = defaultValue.value.type
        return defTypes.some(i => i.value == type) ? type : BuiltInDefaultValueType.MANUAL
      },
      set(value: string){
        defaultValue.value.type = value

        if(value != BuiltInDefaultValueType.MANUAL){
          defaultValue.value.value = undefined
        }
      }
    })
  }
  
  function useCompatValue(getter?: any){
    return computed({
      get: function(){
        if(typeof getter == 'function') return getter(defaultValue.value)

        return defaultValue.value.value
      },
      set(value){
        defaultValue.value.value = value == '' ? undefined : value
      }
    })
  }
  
  function useIsManual(){
    return computed(() => defaultValue.value.type == BuiltInDefaultValueType.MANUAL)
  }

  return {
    useCompatType,
    useCompatValue,
    useIsManual
  }
}