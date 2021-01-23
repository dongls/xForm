import { defineComponent } from 'vue'
import { XFieldConf, XField, XFormModel } from '@dongls/xform'
import { updateValue } from '../util'

import icon from '@common/svg/number.svg'
import setting from './setting.vue'

const build = defineComponent({
  name: 'xform-bs-number',
  props: {
    field: {
      type: XField,
      required: true
    },
    value: {
      type: [Number, String],
      default: null
    }
  },
  setup(props, { emit }){
    return function(){
      return (
        <input
          id={props.field.name} name={props.field.name}
          type="number"
          value={props.value} onInput={updateValue.bind(null, emit, props.field.name)}
          class="form-control form-control-sm"
          placeholder={props.field.placeholder}
        />
      )
    }
  }
})

export default XFieldConf.create({
  icon,
  type: 'number',
  title: '数字',
  setting,
  build,
  validator(field: XField, model: XFormModel){
    const value = model[field.name]
    const isEmpty = null == value || typeof value == 'number' && (isNaN(value) || !isFinite(value))
    if(field.required && isEmpty) return Promise.reject('必填')
    if(field.attributes.integer && !/^[-+]?[1-9]\d*$/.test(value))  return Promise.reject('请输入整数')

    return Promise.resolve()
  }
})