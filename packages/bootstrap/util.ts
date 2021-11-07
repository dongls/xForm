import { useConstant } from '@dongls/xform'

export {
  useValue,
  useField,
  useFieldProp,
  useDefaultValueApi,
  useOptions
} from '@common/util/index'

const { EVENTS } = useConstant()

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
