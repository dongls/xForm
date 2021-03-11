import { constant } from '@dongls/xform'

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

function parseValue(target: any, behavior = 'build'){
  const value: any = target.value
  const type: string = target.type

  if(type == 'number') {
    const n = parseFloat(value)
    return isNaN(n) ? value : n
  }

  if(type == 'select') {
    const dom = target as HTMLSelectElement
    const selectedIndex = dom.selectedIndex
    return selectedIndex < 0 ? null : getValue(dom.options[selectedIndex])
  }

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

  emit(constant.EVENTS.UPDATE_FIELD, { prop, value, scope })
}