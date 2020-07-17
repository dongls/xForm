function parseCheckedValue(element: HTMLInputElement){
  return element.value == null ? element.checked : element.value
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
    return selectedIndex < 0 ? '' : dom.options[selectedIndex]
  }

  if(type == 'checkbox'){
    const selector = `input[type="checkbox"][name="${target.name}"]`
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLInputElement[]
    if(behavior === 'setting' && elements.length == 1) return parseCheckedValue(elements[0])
    
    return elements.filter(e => e.checked).map(parseCheckedValue)
  }
  
  return target.value
}

export function updateValue(emit: Function, name: string, event: InputEvent ){
  const target = event.target
  const value = parseValue(target)

  emit('update:value', { value, name })
}

export function updateField(emit: Function, event: Event, prop: string, scope?: string){
  const target = event.target
  const value = parseValue(target, 'setting')

  emit('update:field', { prop, value, scope })
}