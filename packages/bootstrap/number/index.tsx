import { defineComponent, getCurrentInstance } from 'vue'
import { XFieldConf, XField, useField } from '@dongls/xform'
import icon from '@common/svg/number.svg'
import setting from './setting.vue'
import { updateValue } from '../util'

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
    const instance = getCurrentInstance()
    const detail = {
      key: props.field.name,
      field: props.field,
      prop: props.field.name
    }

    useField(instance, detail)

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

export default new XFieldConf({
  icon,
  type: 'number',
  title: '数字',
  setting,
  build,
  validator(field: XField, value: any){
    const isEmpty = null == value || typeof value == 'number' && (isNaN(value) || !isFinite(value))
    if(field.required && isEmpty) return Promise.reject('必填')
    if(field.attributes.integer && !/^[-+]?[1-9]\d*$/.test(value))  return Promise.reject('请输入整数')

    return Promise.resolve()
  }
})