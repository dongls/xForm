import { FormField, FormSchema, useConstant } from '@dongls/xform'
import { computed, getCurrentInstance, Ref, toRef } from 'vue'

const { EVENTS, BuiltInDefaultValueType } = useConstant()

export function useField(){
  const instance = getCurrentInstance()
  return toRef(instance.props, 'field') as Ref<FormField>
}

export function useFieldProp<T>(prop: string, scope?: string, defaultValue?: any) {
  const fieldRef = useField()
  const instance = getCurrentInstance()

  return computed<T>({
    get(){
      const field = fieldRef.value
      const value = scope ? field?.[scope]?.[prop] : field?.[prop]
      return value ?? defaultValue
    },
    set(v: any){
      const value = v === '' ? undefined : v
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

export function useDefaultValueApi(defTypes: any[] = []){
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
        defaultValue.value.value = value === '' ? undefined : value
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

export function useOptions(afterUpdate?: Function){
  const instance = getCurrentInstance()
  const options = computed(() => (instance.props.field as FormField).options)

  function update(prop: string, value: any, scope?: string){
    instance.emit(EVENTS.UPDATE_FIELD, { prop, value, scope })

    if(typeof afterUpdate == 'function') afterUpdate()
  }
  
  function addOption(){
    const opts = options.value
    opts.push({ value: `选项${opts.length + 1}` })
    update('options', opts)
  }

  function updateOption(event: Event, option: any){
    const target = event.target as HTMLInputElement
    const value: any = target.value

    option.value = value
    update('options', options.value)
  }
  
  function removeOption(option: any){
    const opts = options.value
    if(opts.length <= 1) return

    const index = opts.indexOf(option)
    if(index >= 0) opts.splice(index, 1)

    update('options', opts)
  }
  
  return {
    options,
    addOption,
    updateOption,
    removeOption,
    update
  }
}

export function useSchema(){
  const instance = getCurrentInstance()
  return toRef(instance.props, 'schema') as Ref<FormSchema>
}

export function useSchemaProp<T extends string | boolean | object | any[]>(prop: string, valueOrGetter?: ((schema: FormSchema) => T) | T){
  const schemaRef = useSchema()
  const instance = getCurrentInstance()
  
  return computed<T>({
    get: typeof valueOrGetter == 'function' ? function(){
      return valueOrGetter(schemaRef.value)
    } : function(){
      const schema = schemaRef.value
      return schema[prop] ?? valueOrGetter
    },
    set(v: any){
      const value = v === '' ? undefined : v
      instance.emit(EVENTS.UPDATE_PROP, { prop, value })
    }
  })
}

export function toPrimitive(value: unknown): number | string{
  if(value == null) return null

  const v = typeof value.valueOf == 'function' ? value.valueOf() : value

  if(typeof v == 'string') return v.trim() == '' ? null : v
  if(typeof v == 'number') return v
  if(typeof v == 'boolean') return String(v)

  return null
}
