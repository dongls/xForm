import { ComponentOptions } from 'vue'
import { Field, FieldLogic } from '../model/Field'
import { BaseFormConfig } from '../model/common'
import { isEmpty, isNull, genRandomStr } from '../util'

export interface Preset{
  name: string
  version?: string
  cleanup: void | (() => void)
}

export function createConfig(): BaseFormConfig {
  return {
    modes: null,
    logic: false,
    validation: {
      immediate: true
    },
    genName(){
      return `field_${Date.now().toString(36)}_${genRandomStr()}`
    },
    formatter(field, props){
      const value = field.value
  
      if(isNull(value) || isEmpty(value)) return props.schema.viewerPlaceholder ?? ''
      return Array.isArray(value) ? value.join('，') : value
    }
  }
}

export const store = {
  preset: null as Preset,
  config: createConfig(),
  fields: new Map<string, Field>(),
  slots: new Map<string, ComponentOptions>(),
  logic: new Map<string, FieldLogic>()
}