import { isFunction, isValidArray } from '../util'
import { FormField, BuiltInDefaultValueType } from '../model'

type DefaultValueGenerator = (field: FormField) => any

const generators = new Map<string, DefaultValueGenerator>()

export function registerDefaultValueType(type: string, callback: DefaultValueGenerator){
  generators.set(type, callback)
}

export function removeDefaultValueType(type: string){
  generators.delete(type)
}

export function genDefaultValue(field: FormField){
  const dv = field.defaultValue
  const fn = generators.get(dv?.type)
  const gen = isFunction(fn) ? fn : generators.get(BuiltInDefaultValueType.MANUAL)
  return gen(field)
}

const r = registerDefaultValueType
const b = BuiltInDefaultValueType

r(b.MANUAL, function(field){
  return field.defaultValue?.value
})

r(b.OPTION_ALL, function(field){
  const options = field.options
  return isValidArray(options) ? options.map(o => o.value) : []
})

r(b.OPTION_FIRST, function(field){
  return field.options?.[0]?.value
})

r(b.DATE_NOW, function(){
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
})