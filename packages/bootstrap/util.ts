import { useConstant, FormField } from '@dongls/xform'
import { computed, getCurrentInstance } from 'vue'
import { useFieldProp } from '@common/util'

export { useValue, useField, useFieldProp } from '@common/util/index'

const { BuiltInDefaultValueType, EVENTS } = useConstant()

// retrieve raw value set via :value bindings
function getValue(el: HTMLOptionElement | HTMLInputElement) {
  return '_value' in el ? (el as any)._value : el.value
}

// retrieve raw value for true-value and false-value set via :true-value or :false-value bindings
function getCheckboxValue(el: HTMLInputElement & { _trueValue?: any; _falseValue?: any }) {
  const checked = el.checked
  const key = checked ? '_trueValue' : '_falseValue'
  return key in el ? el[key] : checked
}

function parseCheckedValue(element: HTMLInputElement){
  const value = getValue(element)
  return value == null ? element.checked : element.value
}

export function parseSelectValue(target: HTMLSelectElement){
  const selectedIndex = target.selectedIndex
  return selectedIndex < 0 ? null : getValue(target.options[selectedIndex])
}

function parseValue(target: any, behavior = 'build'){
  const value: any = target.value
  const type: string = target.type

  if(type == 'number') {
    const n = parseFloat(value)
    return isNaN(n) ? value : n
  }

  if(type == 'select') return parseSelectValue(target as HTMLSelectElement)

  if(type == 'checkbox'){
    const selector = `input[type="checkbox"][name="${target.name}"]`
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLInputElement[]
    if(behavior === 'setting' && elements.length == 1) return getCheckboxValue(elements[0])
    
    return elements.filter(e => e.checked).map(parseCheckedValue)
  }
  
  return target.value
}

export function updateField(emit: Function, event: Event, prop: string, scope?: string){
  const target = event.target
  const value = parseValue(target, 'setting')

  emit(EVENTS.UPDATE_FIELD, { prop, value, scope })
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