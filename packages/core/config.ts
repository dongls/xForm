import { FormConfigBase } from './model'
import { isEmpty, isNull, genRandomStr } from './util'

const config: FormConfigBase = {
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
}

export default config