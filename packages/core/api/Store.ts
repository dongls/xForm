import { ComponentOptions } from 'vue'
import { 
  BaseFormConfig,
  FieldConf, 
  FormPreset,
} from '../model'

import { isEmpty, isNull, genRandomStr } from '../util'

export function createConfig(){
  return {
    modes: null,
    logic: true,
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
  } as BaseFormConfig
}

export const store = {
  preset: null as FormPreset,
  config: createConfig(),
  fields: new Map<string, FieldConf>(),
  slots: new Map<string, ComponentOptions>()
}