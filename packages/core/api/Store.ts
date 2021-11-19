import { ComponentOptions } from 'vue'
import { 
  BaseFormConfig,
  FieldConf,
} from '../model'

import { isEmpty, isNull, genRandomStr } from '../util'

type Preset = {
  name: string,
  version?: string,
  cleanup: void | (() => void)
}

export function createConfig(){
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
  } as BaseFormConfig
}

export const store = {
  preset: null as Preset,
  config: createConfig(),
  fields: new Map<string, FieldConf>(),
  slots: new Map<string, ComponentOptions>()
}