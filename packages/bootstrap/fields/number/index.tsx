import { defineComponent } from 'vue'
import { Field, FormField, isEmpty } from '@dongls/xform'
import { useValue } from '@bootstrap/util'
import { NUMBER_VALUE_COMPARE } from '@bootstrap/logic'

import icon from '@common/svg/number.svg'
import setting from './setting.vue'

const build = defineComponent({
  name: 'xform-bs-number',
  props: {
    field: {
      type: FormField,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props){
    const value = useValue<Number>()
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

export default Field.create({
  icon,
  type: 'number',
  title: '数字',
  setting,
  build,
  validator(field, value: number | string){
    if(field.required && isEmpty(value)) return Promise.reject('必填')
    if(field.attributes.integer && !/^[-+]?[1-9]?\d+$/.test(value + '')) return Promise.reject('请输入整数')

    return Promise.resolve()
  },
  logic: [
    NUMBER_VALUE_COMPARE
  ]
})