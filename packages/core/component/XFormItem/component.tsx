import { 
  defineComponent, 
  getCurrentInstance,
  ref,
  computed,
  Ref,
  inject,
} from 'vue'

import { 
  XField, 
  XFormSchema,
  XFormItemContext
} from '@core/model'

import {
  useValidator
} from '@core/util/validator'

import {
  XFORM_FORM_SCHEMA_SYMBOL
} from '@core/model/constant'

import { useModel } from '@core/api'

export type XFormItemProps = {
  field: XField;
  validation: boolean | Function;
}

function renderLabelSuffix(suffix: string){
  if(!suffix) return null

  return <span>{suffix}</span>
}

function renderMessage(message: Ref<string>, validating: Ref<boolean>){
  if(validating.value) return <p class="xform-is-validating">验证中...</p>
  if(message.value) return <p class="xform-item-message">{message.value}</p>
  return null
}

// TODO: prop label
// TODO: prop type
export default defineComponent({
  name: 'xform-item',
  props: {
    field: {
      type: XField,
      default: null
    },
    validation: {
      type: [Boolean, Function],
      default: false
    }
  },
  setup(props: XFormItemProps, { slots }){
    const instance = getCurrentInstance()
    const message = ref<string>(null)
    const validating = ref(false)

    const context: XFormItemContext = { validating, message }
    const needValidate = computed(() => (typeof props.validation == 'boolean' && props.validation) || typeof props.validation == 'function')
    const schema: XFormSchema = inject(XFORM_FORM_SCHEMA_SYMBOL)

    needValidate.value ? useValidator(instance, useModel(), props, context) : null

    return function(){
      const field = props.field

      const labelPosition = schema.labelPosition || 'left'
      const labelSuffix: string = schema.labelSuffix

      const className =  {
        'xform-item': true,
        'xform-is-required': props.field.required, 
        'xform-is-error': !!message.value,
        [`xform-is-${labelPosition}`]: true
      }

      return (
        <div class={className}>
          <label class="xform-item-label" for={field.name}>
            <span class="xform-item-title">{field.title}</span>
            {renderLabelSuffix(labelSuffix)}
          </label>
          <div class="xform-item-content">
            {slots.default()}
            {renderMessage(message, validating)}            
          </div>
        </div>
      )
    }
  }
})