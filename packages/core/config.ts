import { XFormConfigBase } from '@core/model'
import { isEmpty, isNull } from './util/lang'

const config: XFormConfigBase = {
  modes: null,
  validation: {
    enable: true,
    immediate: true
  },
  genName(){
    const time = Date.now().toString(36)
    const random = Math.random().toString(36).slice(-4)

    return `field_${time}_${random}`
  },
  formatter(field, props){
    const value = props.model[field.name]

    if(isNull(value) || isEmpty(value)) return props.schema.viewerPlaceholder ?? ''
    return Array.isArray(value) ? value.join('，') : value
  }
}

export default config