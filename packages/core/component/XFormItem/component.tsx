import { 
  ComputedRef,
  Slots,
  computed,
  defineComponent, 
  h,
  inject,
  onUnmounted,
  reactive,
} from 'vue'

import { 
  AnyProps,
  ComponentEnum,
  PositionEnum,
  ValidStatusEnum,
  XFORM_BUILDER_CONTEXT_PROVIDE_KEY,
  XFORM_FORM_SCHEMA_PROVIDE_KEY,
  XFORM_MODEL_PROVIDE_KEY,
  XField, 
  XFormBuilderContext,
  XFormModel,
  XFormSchema,
} from '@core/model'

import { isFunction } from '@core/util/lang'
import { createValidator } from '@core/util/validator'
import { getFieldComponent } from '@core/util/component'

type XFormItemProps = {
  field: XField;
  validation: boolean | Function;
  title: string;
  type: string;
  name: string;
}

function renderLabelSuffix(suffix: string){
  if(!suffix) return null

  return <span>{suffix}</span>
}

function renderMessage(field: XField){
  const { message, validating } = field.validation
  if(validating) return <p class="xform-is-validating">验证中...</p>
  if(message) return <p class="xform-item-message">{message}</p>
  return null
}

function renderContent(slots: Slots, field: XField, model: XFormModel, context: XFormBuilderContext){
  if(isFunction(slots.default)) return slots.default()

  const component = getFieldComponent(field, ComponentEnum.BUILD)
  const props = { field: field } as AnyProps

  if(null != context){
    props.value = model[field.name]
    props['onUpdate:value'] = context.updateFieldValue
  }

  return h(component, props)
}

function patchField(field: XField, o: any){
  field.type = o.type
  field.name = o.name
  field.title = o.title

  field.required = 'required' in o && o.required !== false
}

function normalizeField(props: XFormItemProps, attrs: any): ComputedRef<XField>{
  if(null != props.field) return computed(() => props.field)

  const virtualField = reactive(new XField()) as XField
  return computed(() => {
    patchField(virtualField, { ...props, ...attrs })
    return virtualField
  })
}

export default defineComponent({
  name: 'xform-item',
  inheritAttrs: false,
  props: {
    field: {
      type: XField,
      default: null
    },
    validation: {
      type: [Boolean, Function],
      default: false
    },
    title: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  setup(props: XFormItemProps, { slots, attrs }){
    const schema = inject<XFormSchema>(XFORM_FORM_SCHEMA_PROVIDE_KEY)
    const context = inject<XFormBuilderContext>(XFORM_BUILDER_CONTEXT_PROVIDE_KEY, null)

    const fieldRef = normalizeField(props, attrs)
    const validation = computed(() => props.validation)
    const model = inject<XFormModel>(XFORM_MODEL_PROVIDE_KEY, null)

    if(null != context){
      const validator = createValidator(fieldRef, validation, model)
      context.registerField(fieldRef.value.name, validator)
      onUnmounted(() => context.removeField(fieldRef.value.name))
    }
    
    return function(){
      const field = fieldRef.value
      const labelPosition = schema.labelPosition ?? PositionEnum.LEFT
      const labelSuffix: string = schema.labelSuffix

      const className =  {
        'xform-item': true,
        [`xform-is-${labelPosition}`]: true,
        'xform-is-required': field.required, 
        'xform-is-error': field.validation.valid == ValidStatusEnum.ERROR
      }
      
      return (
        <div class={className}>
          <label class="xform-item-label" for={field.name}>
            <span class="xform-item-title">{field.title}</span>
            {renderLabelSuffix(labelSuffix)}
          </label>
          <div class="xform-item-content">
            {renderContent(slots, field, model, context)}
            {renderMessage(field)}       
          </div>
        </div>
      )
    }
  }
})