import { defineComponent } from 'vue'
import { XFieldConf, XField, useValue, isEmpty } from '@dongls/xform'

import icon from '@common/svg/number.svg'
import setting from './setting.vue'

const build = defineComponent({
  name: 'xform-bs-number',
  props: {
    field: {
      type: XField,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props){
    const value = useValue<Number>(props)
    return function(){
      return (
        <input
          id={props.field.uid} name={props.field.name}
          type="number"
          v-model={[value.value, ['number']]}
          class="form-control form-control-sm"
          placeholder={props.field.placeholder}
          disabled={props.disabled || props.field.disabled}
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
  validator(field: XField, value: number | string){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    if(field.attributes.integer && !/^[-+]?[1-9]\d*$/.test(value + '')) return Promise.reject('请输入整数')

    return Promise.resolve()
  }
})